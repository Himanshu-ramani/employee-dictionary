import { render, screen } from "@testing-library/react";
import AuthPage from "./AuthPage";
import { Provider } from "react-redux";
import store from "../../ReduxStore/index";
import { Route, Routes } from "react-router-dom";
import LoginPage from "../../Pages/LoginPage";
import { createMemoryHistory } from "history";
import { BrowserRouter } from "react-router-dom";
describe("Auth page comoponent", () => {
  test("first name input   Should be rendered", () => {
    const history = createMemoryHistory(["/Authentication/SignUp"]);
    render(
      <BrowserRouter>
        <Provider store={store}>
          <AuthPage />
        </Provider>
      </BrowserRouter>
    );
    const emailInput = screen.getByPlaceholderText("Email");
    expect(emailInput).toBeInTheDocument();
  });
});
