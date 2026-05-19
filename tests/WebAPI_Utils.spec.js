const {test, expect, request} = require('@playwright/test');
import {APIUtils} from '../utils/APIUtils';

const loginPayload = {userEmail: "testacc1@testemail.com", userPassword: "Echo123$"};
const orderPayload = {orders: [{country: "Mexico", productOrderedId: "6960eac0c941646b7a8b3e68"}]};

let token;
let orderId;

test.beforeAll( async () => {
    //Login API
    const apiContext = await request.newContext();
    const apiUtils = new APIUtils(apiContext, loginPayload);
    orderId = await apiUtils.createOrder(orderPayload);
    token = await apiUtils.getToken();

});


test('Client API test - Sign in > Validate order', async ({ page }) => {

    page.addInitScript(token => {
        window.localStorage.setItem('token', token);
    }, token);

    await page.goto("https://rahulshettyacademy.com/client/");

    const ordersButton = page.getByRole('button', { name: '   ORDERS' });

    await Promise.all([
        page.waitForResponse(res =>
            res.url().includes('/get-orders-for-customer') &&
            res.request().method() === 'GET' &&
            res.status() === 200
        ),
        ordersButton.click()
    ]);

    await expect(page.locator('.table tbody')).toBeVisible();

    const rows = page.locator(".table tbody tr");
    
    for(let i=0; i < await rows.count(); i++){
        const orderIDFromList = await rows.nth(i).locator("th").textContent();
        if(orderIDFromList.replace(/[^a-zA-Z0-9]/g, '') === orderId){
            //console.log("Your order was found listed: " + orderIDFromList);
            await rows.nth(i).locator('button:has-text("View")').click();
            break;
        }
    }

   //Final order validations
    const oderIdDetails = await page.locator("div.col-text").textContent();
    expect(orderId).toBe(oderIdDetails.trim());
});