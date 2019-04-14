import React, { PropTypes } from "react";
import { IntlProvider } from "react-intl";

import { SEGMENT_TRACKING_KEY } from "config";

import Modal from "components/Modal";
import AnalyticsLoader from "app/components/AnalyticsLoader";
import Header from "app/components/Header";
import Footer from "app/components/Footer";
import MetaTags from "app/components/MetaTags";
import NotificationArea from "notifications/containers/NotificationArea";

const App = ({ children, pageMeta, modalChildren }) => (
  <IntlProvider locale="en">
    <div>
      <AnalyticsLoader segmentKey={SEGMENT_TRACKING_KEY} />
      <MetaTags {...pageMeta} />
      <Header />
      {children}
      <Footer />
      <NotificationArea />
      <Modal isOpen={modalChildren !== null}>
        {modalChildren}
      </Modal>
    </div>
  </IntlProvider>
);

App.propTypes = {
  children: PropTypes.node,
  pageMeta: PropTypes.object,
  modalChildren: PropTypes.node
};

export default App;
