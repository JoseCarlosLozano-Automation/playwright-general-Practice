const {test, expect} = require('@playwright/test');

test.only('Pop up validations', async ({ page }) => {

    const url = 'https://rahulshettyacademy.com/AutomationPractice/';

    await page.goto(url);
    //await page.goto('https://google.com');
    //await page.goBack();
    //await page.goForward();
    //await page.goBack();
    //await page.reload();

    //Visible/Hidden validation
    await expect(page.getByRole('textbox', { name: 'Hide/Show Example' })).toBeVisible();
    await page.getByRole('button', { name: 'Hide' }).click();
    await expect(page.getByRole('textbox', { name: 'Hide/Show Example' })).toBeHidden();

    //Event js dialog validation
    page.on('dialog', dialog => dialog.accept());
    await page.getByRole('button', { name: 'Alert' }).click();
    /*const [dialog] = await Promise.all([
        page.waitForEvent('dialog'),
        page.getByRole('button', { name: 'Alert' }).click()
    ]);

    await dialog.accept();
    */
    await page.pause();
    await page.locator('#mousehover').hover();

});