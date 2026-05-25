const {test, expect} = require('@playwright/test');

test('Client App test', async ({ page }) => {

    const email = "";
    const pass = "Echo123$";
    const userName = page.getByPlaceholder("email@example.com");
    const userPass = page.getByPlaceholder("enter your passsword");
    const signInBtn = page.getByRole('button', { name: 'Login' });
    const cartBtn = page.getByRole('button').filter({ hasText: 'Cart' }).filter({ hasNotText: 'Add' });
    const products = page.locator(".card-body");
    const cardTitles = page.locator(".card-body b");
    const checkoutBtn = page.getByRole('button', { name: 'Checkout' });
    const productName = 'ZARA COAT 3';
    
    await page.goto("https://rahulshettyacademy.com/client/");

    await userName.fill(email);
    await userPass.fill(pass);
    await signInBtn.click();

    await page.waitForLoadState('networkidle'); // This method waits for the API calls to be completely loaded. Useful in the example below, where we need to fetch some titles and we expect the data to be there
    await expect(cardTitles.first()).toBeVisible(); // This method waits for a specific element to be completely loaded, only then we know that we can interact with it

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

test('codegen Test', async ({ page }) => {
    await page.goto('https://rahulshettyacademy.com/angularpractice/');
    await page.getByRole('link', { name: 'Shop' }).click();
    await page.locator('app-card').filter({ hasText: 'Samsung Note 8 $24.99 Lorem' }).getByRole('button').click();
    await page.locator('app-card').filter({ hasText: 'Blackberry $24.99 Lorem ipsum' }).getByRole('button').click();
    await page.getByRole('link', { name: 'Category 2' }).click();
    await page.getByRole('link', { name: 'Shop' }).click();
    await page.locator('app-card').filter({ hasText: 'iphone X $24.99 Lorem ipsum' }).getByRole('button').click();
    await page.locator('app-card').filter({ hasText: 'Nokia Edge $24.99 Lorem ipsum' }).getByRole('button').click();
    await page.getByText('Checkout ( 2 ) (current)').click();
    await page.getByRole('button', { name: 'Continue Shopping' }).click();
    await page.locator('app-card').filter({ hasText: 'Samsung Note 8 $24.99 Lorem' }).getByRole('button').click();
    await page.locator('app-card').filter({ hasText: 'Blackberry $24.99 Lorem ipsum' }).getByRole('button').click();
    await page.locator('app-card').filter({ hasText: 'Blackberry $24.99 Lorem ipsum' }).getByRole('button').click();
    await page.getByText('Checkout ( 3 ) (current)').click();
    await page.getByRole('row', { name: 'Blackberry by Sim cart Status' }).locator('#exampleInputEmail1').fill('1');
    await page.getByRole('button', { name: 'Checkout' }).click();
    await page.getByRole('textbox', { name: 'Please choose your delivery' }).pressSequentially('ame', {delay:150});
    await page.waitForTimeout(200);
    await page.getByText('United States of America').click();
    await page.getByText('I agree with the term &').click();
    await page.getByRole('button', { name: 'Purchase' }).click();
    await expect(page.locator('app-checkout')).toContainText('Please choose your delivery location. Then click on purchase button');
    await expect(page.getByText('× Success! Thank you! Your')).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Please choose your delivery' })).toHaveValue('United States of America');
});