import { test, expect } from '@playwright/test';

let email: string;
let password: string;


// ==========================================
// TEST DATA SETUP
// ==========================================

test.beforeEach(async ({ request, browserName }) => {
    email = `playwright-${browserName}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}@example.com`;
    password = 'Test123456!';
    const response = await request.post('https://thinking-tester-contact-list.herokuapp.com/users',
        {
            data: {
                firstName: 'Playwright',
                lastName: 'Tester',
                email: email,
                password: password
            }
        }
    );

    console.log('Create user status:',response.status());
    console.log('Created email:', email);
    
    expect(response.status()).toBe(201);

});


// ==========================================
// LOGIN
// ==========================================

test('login with API validation', async ({ page }) => {
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

    console.log('Login status:',loginResponse.status());

    expect(loginResponse.status()).toBe(200);
    await expect(page).toHaveURL(/contactList/);
    await expect(page.getByRole('heading', {name: 'Contact List'})).toBeVisible();

});


// ==========================================
// LOGOUT
// ==========================================

test('logout with API validation', async ({ page }) => {
    // Login
    await page.goto('https://thinking-tester-contact-list.herokuapp.com/');
    await page.getByPlaceholder('Email').fill(email);
    await page.getByPlaceholder('Password').fill(password);
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page).toHaveURL(/contactList/);

    // Listen for logout API
    const logoutResponsePromise = page.waitForResponse(
        response =>
            response.url().includes('/users/logout') &&
            response.request().method() === 'POST'
    );


    // Logout
    await page.getByRole('button', { name: 'Logout' }).click();
    const logoutResponse = await logoutResponsePromise;
    console.log('Logout status:',logoutResponse.status());
    expect(logoutResponse.status()).toBe(200);

    // Validate UI
    await expect(page.getByPlaceholder('Email')).toBeVisible();
    await expect(page.getByPlaceholder('Password')).toBeVisible();
});