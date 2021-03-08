import React from 'react';
import { EditorBody } from './editor/Editor';
import { CustomSideToolbarEditor } from './editor4/Editor';
import { Provider } from "react-redux";
import { store } from "./store";
function App() {
  return (
    <Provider store={store}>
      <div className="app">
        <CustomSideToolbarEditor />
      </div>
    </Provider>
  );
}

export default App;
