import { createRoot } from 'react-dom/client';

import { ComponentType } from 'react';
import * as Components from './components';

export function renderComponent(e: HTMLElement, componentName: string) {
  const Component: ComponentType<any> = Components[componentName];
  if (!Component) {
    console.error('You have not provided a component');
    return;
  }

  let props: any;
  try {
    props = JSON.parse(e.getAttribute('data-react-props') ?? '');
  } catch (e) {
    console.error(`Cannot parse props for component ${componentName}, it need to be a json serialized`);
    return;
  }

  createRoot(e).render(<Component {...props} />);
}
