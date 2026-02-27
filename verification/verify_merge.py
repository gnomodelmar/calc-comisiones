
from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        # Navigate to the app
        page.goto("http://localhost:8080")

        # Wait for the original content
        page.wait_for_selector("text=Hello, world!")

        # Wait for the new content (list)
        page.wait_for_selector("payment-methods-app")
        page.wait_for_selector("payment-method-list")

        # Take a screenshot
        page.screenshot(path="verification/4_merged_view.png")
        print("Screenshot 4: Merged view captured")

        browser.close()

if __name__ == "__main__":
    run()
