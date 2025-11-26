const { SquareClient, SquareEnvironment } = require('square');

const client = new SquareClient({
    token: 'test',
    environment: SquareEnvironment.Sandbox,
});

if (client.checkout.paymentLinks) {
    console.log('PaymentLinks methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(client.checkout.paymentLinks)));
}

if (client.orders) {
    console.log('Orders methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(client.orders)));
}
