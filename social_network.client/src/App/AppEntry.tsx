
import "./index.css";
// eslint-disable-next-line import/order
import { ConfigProvider } from "antd";
import { Provider } from "react-redux";
import { store } from "@/App/store/AppStore";
import { AppRouter } from "@/App/router/AppRouter.tsx";
// eslint-disable-next-line import/order
import uk from 'antd/locale/uk_UA';

import 'dayjs/locale/uk.js';
// eslint-disable-next-line import/order
import dayjs from "dayjs";


dayjs.locale('uk');
const configTheme = {
    theme: {
        token: {
            colorPrimary: "d43832"
        }
    }
};
export const AppEntry = () =>
        <ConfigProvider locale={uk} theme={configTheme.theme}>
            <Provider store={store}>
                <AppRouter />
            </Provider>
        </ConfigProvider>
