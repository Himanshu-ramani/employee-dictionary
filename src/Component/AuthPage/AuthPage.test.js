import { render, screen } from "@testing-library/react";
import AuthPage from "./AuthPage";
import { Provider } from "react-redux";
import store from "../../ReduxStore/index";
import { Route, Routes } from "react-router-dom";

describe("Auth page comoponent", () => {
  test("first name Should be rendered", () => {
    render(
      <Provider store={store}>
        <Routes>
          <Route element={<AuthPage />} />
        </Routes>
      </Provider>
    );
    const emailInput = screen.getByPlaceholderText("Email");
    expect(emailInput).toBeInTheDocument();
  });
});
