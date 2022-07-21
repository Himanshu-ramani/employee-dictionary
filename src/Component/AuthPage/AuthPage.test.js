import { render, screen } from "@testing-library/react";
import AuthPage from "./AuthPage";
import { Provider } from "react-redux";
import store from "../../ReduxStore/index";
import { Route, Routes } from "react-router-dom";
import LoginPage from "../../Pages/LoginPage";
import { createMemoryHistory } from "history";
describe("Auth page comoponent", () => {
  test("first name Should be rendered", () => {
    const history = createMemoryHistory();
    render(
      <Provider store={store}>
        <Routes history={history}>
          <LoginPage />
        </Routes>
      </Provider>
    );
    const emailInput = screen.getByPlaceholderText("Email");
    expect(emailInput).toBeInTheDocument();
  });
});
