import { Client } from "@elastic/elasticsearch";
import dotenv from 'dotenv';
dotenv.config();

let elasticClient;

try {
    elasticClient = new Client({
        cloud: {
            id: process.env.ELASTIC_CLOUD_ID,
        },
        auth: {
            username: process.env.ELASTIC_USERNAME,
            password: process.env.ELASTIC_PASSWORD,
        },
    });
    console.log('Elasticsearch connection was successful!');
} catch (error) {
    console.error('Error connecting to Elasticsearch:', error);
}

export default elasticClient;