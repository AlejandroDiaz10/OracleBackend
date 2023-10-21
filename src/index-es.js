import elasticClient from './elastic-client.js';
import oracleConnection from './oracle.js';

function mapToElasticsearchDocument(oracleData, tableName) {
    let doc = {};
    if (tableName === 'products') {
        doc = {
            id: oracleData[0],
            product_name: oracleData[1],
            description: oracleData[2],
            list_price: oracleData[3],
            sale_price: oracleData[4],
            brand: oracleData[5],
            category: oracleData[6],
            available: oracleData[7]
        };
    } else if(tableName === 'customers'){
        doc = {
            id: oracleData[0],
            name: oracleData[1],
            age: oracleData[2],
            ssn: oracleData[3],
            occupation: oracleData[4],
            annual_income: oracleData[5],
            monthly_inhand_salary: oracleData[6],
            num_bank_accounts: oracleData[7],
            num_credit_card: oracleData[8]
        };
    } else if(tableName === 'orders'){
        doc = {
            order_line_id: oracleData[0],
            id: oracleData[1],
            order_priority: oracleData[2],
            customer_id: oracleData[3],
            customer_segment: oracleData[4],
            product_id: oracleData[5],
            product_container: oracleData[6],
            profit: oracleData[7],
            quantity_ordered: oracleData[8],
            sales: oracleData[9],
            discount: oracleData[10],
            gross_unit_price: oracleData[11],
            shipping_cost: oracleData[12],
            ship_mode: oracleData[13],
            ship_date: oracleData[14],
            order_date: oracleData[15],
        };  
    } else if(tableName === 'credit_status'){
        doc = {
            id: oracleData[0],
            customer_id: oracleData[1],
            month: oracleData[2],
            interest_rate: oracleData[3],
            num_of_loan: oracleData[4],
            type_of_loan: oracleData[5],
            delay_from_due_date: oracleData[6],
            num_of_delayed_payment: oracleData[7],
            credit_mix: oracleData[8],
            credit_history_age: oracleData[9],
            payment_of_min_amount: oracleData[10],
            payment_behaviour: oracleData[11],
            monthly_balance: oracleData[12]
        };
    }
    return doc;
}

async function fetchAndIndexData(tableName) {
    const oracleData = await oracleConnection.execute(`SELECT * FROM ${tableName}`);
    const rows = oracleData.rows;

    for (let i = 0; i < rows.length; i++) {
        const innerArray = rows[i];
        try {
            const document = mapToElasticsearchDocument(innerArray, tableName);
            const result = await elasticClient.index({
                index: tableName,
                body: document,
            });
            console.log('Indexed data in Elasticsearch:', result);
        } catch (error) {
            console.error('Error indexing data in Elasticsearch:', error);
        }
    }

    await elasticClient.indices.refresh({ index: tableName })
}

export default fetchAndIndexData;