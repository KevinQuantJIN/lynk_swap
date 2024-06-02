import { LiFiWidget, WidgetConfig } from '@lifi/widget';

const widgetConfig: WidgetConfig = {
  containerStyle: {
    border: '1px solid rgb(234, 234, 234)',
    borderRadius: '16px',
  },
};

export const WidgetPage = () => {
  return (
    <LiFiWidget integrator="lynkswap" config={widgetConfig} />
  );
};
