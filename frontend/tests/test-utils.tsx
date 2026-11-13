import { render, RenderOptions } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import React, { ReactElement } from "react";
import { push, replace, setMessages, showToastMock } from "../vitest.setup";

const locale = "en";
const messages = {};

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
};
const customRender = (ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) => {
  const user = userEvent.setup();

  const utils = render(ui, { wrapper: AllTheProviders, ...options });

  const query = {
    get: {
      byTestId: utils.getByTestId,
      byRole: utils.getByRole,
      byText: utils.getByText,
      byLabel: utils.getByLabelText,
      byPlaceholder: utils.getByPlaceholderText,
    },
    find: {
      byRole: utils.queryByRole,
      byText: utils.queryByText,
      byTestId: utils.queryByTestId,
      byPlaceholder: utils.queryByPlaceholderText,
    },
    container: utils.container,
  };

  return {
    ...utils,
    user,
    query,
  };
};

export * from "@testing-library/react";
export { push, customRender as render, replace, setMessages, showToastMock };
