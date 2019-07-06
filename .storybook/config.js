import { configure } from '@storybook/vue';

const req = require.context('../src/stories/views/', true, /Story\.js$/)


function loadStories() {
  req.keys().forEach(req)
}

configure(loadStories, module);
