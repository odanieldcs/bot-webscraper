import config from './config/config';
import datasource from './config/datasource';
import cheerio from 'cheerio';
import request from 'request-promise';
import interval from 'interval-promise';

const db = datasource(config);

const modelPages = db.models.pages;
const modelProducts = db.models.products;

function getUrlsToScrape(amount) {
  return new Promise((resolve, reject) => {
    modelPages.findAll({
      where: {
        read: 0
      },
      limit: amount
    })
    .then(urls => {
      var urlsToReturn = [];

      for (let index = 0; index < urls.length; index++) {
        urlsToReturn.push({
          url: urls[index].url,
          id: urls[index].id,
        });
      }

      resolve(urlsToReturn);
    })
    .catch(err => {
      reject(err);
    })
  })
}

function updatePageScraped(id) {
  return new Promise((resolve, reject) => {
    modelPages.findOne({ where: { id } })
      .then(urlScraped => {

        urlScraped.read = true;
        urlScraped.save();

        resolve();
      })
      .catch(err => {
        reject(err);
      });
  });
}

function requestBody(url) {
  return new Promise((resolve, reject) => {
    const options = {
      url,
      transform: function(body) {
        return cheerio.load(body);
      }
    };

    request.get(options)
      .then(($) => {

        // Percorre a lista de produtos
        $('#searchResults li.article').each(function(){
          var productML = $(this).find('div.rowItem').attr('id');
          var url = $(this).find('.item__info-link').attr('href');
          var name = $(this).find('.list-view-item-title').text();

          var shipping = $(this).find('div.item__shipping > p').text();

          var decimal = $(this).find('div.item__price > span.price__decimals').text();
          var price = $(this).find('div.item__price > span.price__fraction').text();
          price = price.replace('.', '') + (decimal != '' ? '.' + decimal : '.00');


          // Verifica se a url já existe
          modelProducts.findOne({where: { productML }})
            .then((product) => {
              if(product == null) {

                let newProduct = {
                  productML, url, name, price, decimal, shipping
                };

                modelProducts.create(newProduct);
              }
            })
        });
        
        // Percorre a lista de páginas para salvar os links futuros
        $('.pagination__container > ul > li').each(function(){
          const url = $(this).find('a').attr('href');

          if(url != '#') {
            modelPages.findOrCreate({ where: { url } });
          }
        });

        resolve();
      })
      .catch((err) => {
        reject(err);
      })
  })
}

async function main() {
  try {
    const pagesToScrape = await getUrlsToScrape(3);

    if (pagesToScrape.length > 0) {
      for (let index = 0; index < pagesToScrape.length; index++) {
        const page = pagesToScrape[index];
        console.log(page.url)
        await requestBody(page.url);
        await updatePageScraped(page.id);
        console.log('Página lida com sucesso.\n');
      }

    } else {
      console.log('Não existem novas urls disponíveis.\n')
    }
  } catch (error) {
    console.log(error);
  }
}

interval(async () => {
  await main()
}, 10000)