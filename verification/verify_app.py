
from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        # Navigate to the app
        page.goto("http://localhost:8080")

        # Wait for the list to render
        page.wait_for_selector("payment-methods-app")

        # Take a screenshot of the initial list view
        page.screenshot(path="verification/1_list_view.png")
        print("Screenshot 1: List view captured")

        # Click the edit button on the first card (NAVE)
        # We need to access the shadow DOM
        # The structure is: payment-methods-app -> shadow -> payment-method-list -> shadow -> payment-method-card -> shadow -> button.edit-btn

        # Since piercing shadow DOM with selectors can be tricky, let's try to find the first card and click its edit button using JS or piercing selectors if supported.
        # Playwright supports >> to pierce shadow DOM

        # Click the edit button of the first card
        page.locator("payment-method-card >> .edit-btn").first.click()

        # Wait for the editor to appear
        page.wait_for_selector("payment-method-editor")

        # Take a screenshot of the editor view
        page.screenshot(path="verification/2_editor_view.png")
        print("Screenshot 2: Editor view captured")

        # Modify the name
        name_input = page.locator("payment-method-editor >> #name")
        name_input.fill("NAVE - Modificado")

        # Click save
        page.locator("payment-method-editor >> .btn-primary").click()

        # Wait for list view again
        page.wait_for_selector("payment-method-list")

        # Take a screenshot of the updated list view
        page.screenshot(path="verification/3_list_view_updated.png")
        print("Screenshot 3: Updated list view captured")

        browser.close()

if __name__ == "__main__":
    run()
