import { test, expect, request } from '@playwright/test';

let webContext;
let email = "testacc1@testemail.com";
let pass = "Echo123$";

test.beforeAll( async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    const userName = page.getByPlaceholder("email@example.com");
    const userPass = page.getByPlaceholder("enter your passsword");
    const signInBtn = page.getByRole('button', { name: 'Login' });
    
    await page.goto("https://rahulshettyacademy.com/client/");
    await userName.fill(email);
    await userPass.fill(pass);
    await signInBtn.click();
    await page.waitForLoadState('networkidle');

    await context.storageState({ path: 'state.json' });

    webContext = await browser.newContext({ storageState: 'state.json' });

});


test('Client App test after beforeall Sign in flow - 1', async () => {
    const page = await webContext.newPage();
    const cartBtn = page.getByRole('button').filter({ hasText: 'Cart' }).filter({ hasNotText: 'Add' });
    const products = page.locator(".card-body");
    const cardTitles = page.locator(".card-body b");
    const checkoutBtn = page.getByRole('button', { name: 'Checkout' });
    const productName = 'ZARA COAT 3';

    await page.goto("https://rahulshettyacademy.com/client/");
    
    await expect(cardTitles.first()).toBeVisible();

    await products.filter({ hasText: productName }).getByRole("button", {name:"Add To Cart"}).click();

    await cartBtn.click();

    await expect(page.getByText("ZARA COAT 3")).toBeVisible();

    await checkoutBtn.click();

    await page.locator('div:has-text("Expiry Date") select').first().selectOption('04');
    await page.locator('div:has-text("Expiry Date") select').nth(1).selectOption('30');

    await page.locator('div .field.small input').first().fill('651');
    await page.locator('div .field').nth(3).locator('input').fill('Automation tester');
    await page.getByPlaceholder("Select Country").pressSequentially('Ind', {delay:150});

    const dropDown =  page.locator("section .ta-results");
    await dropDown.getByRole('button', { name: 'Indonesia' }).click();

    await expect(page.locator(".user__name label[type='text']")).toHaveText(email);
    await page.getByText("PLACE ORDER").click();
    
    await expect(page.locator("h1.hero-primary")).toHaveText(" Thankyou for the order. ");
    const orderId = await page.locator(".em-spacer-1 .ng-star-inserted").textContent();
    const cleanOrderId = orderId.replace(/[^a-zA-Z0-9]/g, '');
    expect(cleanOrderId).toMatch(/^[a-z0-9]+$/i);
    //console.log("Your order is: " + cleanOrderId);

    const ordersButton = page.locator("label:has-text(' Orders History Page ')");

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
        if(orderIDFromList.replace(/[^a-zA-Z0-9]/g, '') === cleanOrderId){
            //console.log("Your order was found listed: " + orderIDFromList);
            await rows.nth(i).locator('button:has-text("View")').click();
            break;
        }
    }


   //Final order validations
    const oderIdDetails = await page.locator("div.col-text").textContent();
    expect(cleanOrderId.includes(oderIdDetails)).toBeTruthy();

});


test('Client App test after beforeall Sign in flow - 2', async () => {
    const page = await webContext.newPage();
    const cardTitles = page.locator(".card-body b");
    await page.goto("https://rahulshettyacademy.com/client/");

    console.log(await cardTitles.first().textContent());

});