/* tslint:disable:max-line-length */
import { findConfigFile } from '../../../utils/workspace';
import { StandaloneAttribute } from './common';
import fs from 'fs';
import {
  HTMLTagSpecification,
  IHTMLTagProvider,
  collectTagsDefault,
  collectAttributesDefault,
  collectValuesDefault,
  genAttribute,
  AttributeCollector,
  Priority,
  Attribute
} from './common';

function getAttribute(label: string, type: string | undefined, documentation: string) {
  const linkedDocumentation = documentation + '\n\n' + `[API Reference](https://vuejs.org/v2/api/#${label})`;
  return genAttribute(label, type, linkedDocumentation);
}

const vueDirectives = [
  getAttribute('v-text', undefined, 'Updates the element’s `textContent`.'),
  getAttribute('v-html', undefined, 'Updates the element’s `innerHTML`. XSS prone.'),
  getAttribute(
    'v-show',
    undefined,
    'Toggle’s the element’s `display` CSS property based on the truthy-ness of the expression value.'
  ),
  getAttribute(
    'v-if',
    undefined,
    'Conditionally renders the element based on the truthy-ness of the expression value.'
  ),
  getAttribute('v-else', 'v', 'Denotes the “else block” for `v-if` or a `v-if`/`v-else-if` chain.'),
  getAttribute('v-else-if', undefined, 'Denotes the “else if block” for `v-if`. Can be chained.'),
  getAttribute('v-for', undefined, 'Renders the element or template block multiple times based on the source data.'),
  getAttribute('v-on', undefined, 'Attaches an event listener to the element.'),
  getAttribute('v-bind', undefined, 'Dynamically binds one or more attributes, or a component prop to an expression.'),
  getAttribute('v-model', undefined, 'Creates a two-way binding on a form input element or a component.'),
  getAttribute('v-pre', 'v', 'Skips compilation for this element and all its children.'),
  getAttribute('v-cloak', 'v', 'Indicates Vue instance for this element has NOT finished compilation.'),
  getAttribute('v-once', 'v', 'Render the element and component once only.'),
  getAttribute('key', undefined, 'Hint at VNodes identity for VDom diffing, e.g. list rendering'),
  getAttribute('ref', undefined, 'Register a reference to an element or a child component.'),
  getAttribute(
    'slot',
    undefined,
    'Used on content inserted into child components to indicate which named slot the content belongs to.'
  ),
  getAttribute(
    'slot-scope',
    undefined,
    'the name of a temporary variable that holds the props object passed from the child'
  )
];

const transitionProps = [
  getAttribute('name', undefined, 'Used to automatically generate transition CSS class names. Default: "v"'),
  getAttribute('appear', 'b', 'Whether to apply transition on initial render. Default: false'),
  getAttribute(
    'css',
    'b',
    'Whether to apply CSS transition classes. Defaults: true. If set to false, will only trigger JavaScript hooks registered via component events.'
  ),
  getAttribute(
    'type',
    'transType',
    'The event, "transition" or "animation", to determine end timing. Default: the type that has a longer duration.'
  ),
  getAttribute(
    'mode',
    'transMode',
    'Controls the timing sequence of leaving/entering transitions. Available modes are "out-in" and "in-out"; Defaults to simultaneous.'
  )
].concat(
  [
    'enter-class',
    'leave-class',
    'appear-class',
    'enter-to-class',
    'leave-to-class',
    'appear-to-class',
    'enter-active-class',
    'leave-active-class',
    'appear-active-class'
  ].map(t => genAttribute(t))
);

function genTag(tag: string, doc: string, attributes: Attribute[]) {
  return new HTMLTagSpecification(doc + '\n\n' + `[API Reference](https://vuejs.org/v2/api/#${tag})`, attributes);
}

const vueTags = {
  component: genTag(
    'component',
    'A meta component for rendering dynamic components. The actual component to render is determined by the `is` prop.',
    [
      genAttribute('is', undefined, 'the actual component to render'),
      genAttribute('inline-template', 'v', 'treat inner content as its template rather than distributed content')
    ]
  ),
  transition: genTag(
    'transition',
    '<transition> serves as transition effects for single element/component. It applies the transition behavior to the wrapped content inside.',
    transitionProps
  ),
  'transition-group': genTag(
    'transition-group',
    'transition group serves as transition effects for multiple elements/components. It renders a <span> by default and can render user specified element via `tag` attribute.',
    transitionProps.concat(genAttribute('tag'), genAttribute('move-class'))
  ),
  'keep-alive': genTag(
    'keep-alive',
    'When wrapped around a dynamic component, <keep-alive> caches the inactive component instances without destroying them.',
    ['include', 'exclude'].map(t => genAttribute(t))
  ),
  slot: genTag(
    'slot',
    '<slot> serve as content distribution outlets in component templates. <slot> itself will be replaced.',
    [genAttribute('name', undefined, 'Used for named slot')]
  ),
  template: new HTMLTagSpecification(
    'The template element is used to declare fragments of HTML that can be cloned and inserted in the document by script.',
    [
      genAttribute(
        'scope',
        undefined,
        '(deprecated) a temporary variable that holds the props object passed from the child'
      ),
      genAttribute('slot', undefined, 'the name of scoped slot')
    ]
  )
};

const valueSets = {
  transMode: ['out-in', 'in-out'],
  transType: ['transition', 'animation'],
  b: ['true', 'false']
};

export function getVueTagProvider(): IHTMLTagProvider {
  return {
    getId: () => 'vue',
    priority: Priority.Framework,
    collectTags: collector => collectTagsDefault(collector, vueTags),
    collectAttributes: (tag: string, collector: AttributeCollector) => {
      collectAttributesDefault(tag, collector, vueTags, vueDirectives);
    },
    collectValues: (tag: string, attribute: string, collector: (value: string) => void) => {
      collectValuesDefault(tag, attribute, collector, vueTags, vueDirectives, valueSets);
    }
  };
}

export function getVueCustomTagProvider(packageRoot: string, rootPkgJson: any): IHTMLTagProvider | null {
  if (!rootPkgJson.vetur) {
    return null;
  }
  const globalAttributesPath = findConfigFile(packageRoot, rootPkgJson.vetur.globalAttributes);
  try {
    if (globalAttributesPath) {
      const directiveJson = JSON.parse(fs.readFileSync(globalAttributesPath, 'utf-8')) as Array<{
        name: string,
        tip: string
      }>;
      let globalAttributes = new Array<StandaloneAttribute>()
      directiveJson.forEach(item => {
        globalAttributes.push(getAttribute(item.name, undefined, item.tip))
      })
      console.log("Custom", globalAttributes);
      return {
        getId: () => 'vue',
        priority: Priority.Framework,
        collectTags: collector => collectTagsDefault(collector, vueTags),
        collectAttributes: (tag: string, collector: AttributeCollector) => {
          collectAttributesDefault(tag, collector, vueTags, globalAttributes);
        },
        collectValues: (tag: string, attribute: string, collector: (value: string) => void) => {
          collectValuesDefault(tag, attribute, collector, vueTags, globalAttributes, valueSets);
        }
      };
    }
    return null;
  } catch (err) {
    console.error(err.stack);
    return null;
  }



}
