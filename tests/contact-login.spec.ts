import { test, expect } from '@playwright/test';

test.describe.serial('User authentication', () => {
    let email: string;
    const password = 'samplePassword!';
    test('sign up', async ({ page , browserName}) => {
        await page.goto('https://thinking-tester-contact-list.herokuapp.com/');
        await page.getByRole('button', { name: 'Sign up' }).click();
        await expect(page).toHaveURL(/addUser/);

        email =
            `playwright-${browserName}-${Date.now()}-${Math.random()
                .toString(36)
                .substring(2, 8)}@example.com`;

        await page.getByPlaceholder('First Name').fill('FName');
        await page.getByPlaceholder('Last Name').fill('LName');
        await page.getByPlaceholder('Email').fill(email);
        await page.getByPlaceholder('Password').fill(password);

        // Wait for the response to the POST request to /users before clicking the submit button
        const loginResponsePromise = page.waitForResponse(
            response =>
                response.url().includes('/users') &&
                response.request().method() === 'POST'
        );       

        await page.getByRole('button', { name: 'Submit' }).click();
        const loginResponse = await loginResponsePromise;

        // API validation
        expect(loginResponse.status()).toBe(201);

        //UI validation after successful Signup
        await expect(page).toHaveURL(/contactList/);
        await expect(
            page.getByRole('heading', { name: 'Contact List' })
        ).toBeVisible();

    });

    test('login using created account', async ({ page }) => {
        await page.goto('https://thinking-tester-contact-list.herokuapp.com/');
        await page.getByPlaceholder('Email').fill(email);
        await page.getByPlaceholder('Password').fill(password);

        const loginResponsePromise = page.waitForResponse(
            response =>
                response.url().includes('/users/login') &&
                response.request().method() === 'POST'
        );

        await page.getByRole('button', { name: 'Submit' }).click();
        const loginResponse = await loginResponsePromise;
        expect(loginResponse.status()).toBe(200);
        await expect(page).toHaveURL(/contactList/);
    });

    test('logout', async ({ page }) => {
        // Login first because every Playwright test gets a fresh browser page
        await page.goto('https://thinking-tester-contact-list.herokuapp.com/');
        await page.getByPlaceholder('Email').fill(email);
        await page.getByPlaceholder('Password').fill(password);
        await page.getByRole('button', { name: 'Submit' }).click();
        await expect(page).toHaveURL(/contactList/);

        // Logout
        await page.getByRole('button', { name: 'Logout' })
            .click();


        // Verify logout
        await expect(page).toHaveURL(/herokuapp.com/);
        await expect(
            page.getByRole('button', { name: 'Submit' })
        ).toBeVisible();

});

});