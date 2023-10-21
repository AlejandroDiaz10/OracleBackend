// backend/elastic-client.js
import { Client } from "@elastic/elasticsearch";
import dotenv from 'dotenv';

dotenv.config();
const elasticClient = new Client({
    cloud: {
        id: process.env.ELASTIC_CLOUD_ID,
    },
    auth: {
        username: process.env.ELASTIC_USERNAME,
        password: process.env.ELASTIC_PASSWORD,
    },
});

elasticClient.info()
    .then(response => console.log("Connected\n", response))
    .catch(error => console.error(error))

async function run() {

    // await elasticClient.index({
    //     index: 'game-of-thrones',
    //     body: {
    //         character: 'Ned Stark',
    //         quote: 'Winter is coming.'
    //     }
    // })

    // await elasticClient.index({
    //     index: 'game-of-thrones',
    //     body: {
    //         character: 'Daenerys Targaryen',
    //         quote: 'I am the blood of the dragon.'
    //     }
    // })

    // await elasticClient.index({
    //     index: 'game-of-thrones',
    //     body: {
    //         character: 'Tyrion Lannister',
    //         quote: 'A mind needs books like a sword needs whetstone.'
    //     }
    // })

    await elasticClient.indices.refresh({ index: 'game-of-thrones' })

    console.log('Indexed some quotes',)

    // Let's search!
    const searchResult = await elasticClient.search({
        index: 'game-of-thrones',
        q: 'winter'
    });

    console.log(searchResult.hits.hits)

    // const { body } = await elasticClient.search({
    //     index: 'game-of-thrones',
    //     body: {
    //         query: {
    //             // match: { quote: 'winter' }
    //             match_all: {}
    //         }
    //     }
    // })

    // console.log(body)
}
run().catch(console.log)

// async function read() {
//     const { body } = await elasticClient.search({
//         index: 'game-of-thrones',
//         body: {
//             query: {
//                 // match: { quote: 'winter' }
//                 match_all: {}
//             }
//         }
//     });

//     if (body.hits) {
//         console.log(body.hits.hits);
//     } else {
//         console.log('No results found.');
//     }
// }


// read().catch(console.log)

// export default elasticClient;