import { createRoot, Root } from 'react-dom/client';

import { ComponentType } from 'react';
import * as Components from './components';

const storedRoots = new Map<string, Root>();

export function renderComponent(elem: HTMLElement, componentName: string, id: string) {
  const _renderComponent = () => {
    const Component: ComponentType<any> = Components[componentName];
    if (!Component) {
      console.error(`Cannot find Component with name: ${componentName}, is the component exported?`);
      return;
    }

    let props: any;
    try {
      props = JSON.parse(elem.getAttribute('data-react-props') ?? '');
    } catch (e) {
      console.error(`Cannot parse props for component ${componentName}, it needs to be a json serialized`);
      return;
    }

    if (storedRoots.has(id)) {
      const storedRoot = storedRoots.get(id);
      if (storedRoot) storedRoot.unmount();
      storedRoots.delete(id);
    }

    const newRoot = createRoot(elem);
    storedRoots.set(id, newRoot);
    newRoot.render(<Component {...props} />);
  };
  _renderComponent();
}
