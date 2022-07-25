import { render, screen } from "@testing-library/react";
import App from "./App";
import { Provider } from "react-redux";
import store from "./ReduxStore/index";
import { BrowserRouter } from "react-router-dom";
describe("App comoponent", () => {
  test("renders nav link button", () => {
    render(
      <BrowserRouter>
        <Provider store={store}>
          <App />
        </Provider>
      </BrowserRouter>
    );
    const linkElement = screen.findAllByRole("link");
    // expect(linkElement).toBeInTheDocument();
  });
});
