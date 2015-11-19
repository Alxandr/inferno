import updateFragment from './updateFragment';
import fragmentValueTypes from '../enum/fragmentValueTypes';
import updateFragmentList from './updateFragmentList';
import eventManager from '../events/eventManager';
import events from '../events/shared/events';
import setValueForProperty from '../template/setValueForProperty';
import updateComponent from './updateComponent';

// TODO updateFragmentValue and updateFragmentValues uses *similar* code, that could be
// refactored to by more DRY. although, this causes a significant performance cost
// on the v8 compiler. need to explore how to refactor without introducing this performance cost
function updateFragmentValues(context, oldFragment, fragment, component) {
    for (let i = 0, length = fragment.templateValues.length; i < length; i++) {
        let element = oldFragment.templateElements[i];
        let type = oldFragment.templateTypes[i];
        let templateComponent = oldFragment.templateComponents[i];

        fragment.templateElements[i] = element;
        fragment.templateTypes[i] = type;
        fragment.templateComponents[i] = templateComponent;

        if (fragment.templateValues[i] !== oldFragment.templateValues[i]) {
            switch (type) {
                case fragmentValueTypes.LIST:
                case fragmentValueTypes.LIST_REPLACE:
                    updateFragmentList(context, oldFragment.templateValues[i], fragment.templateValues[i], element, component);
                    break;
                case fragmentValueTypes.TEXT:
                    element.firstChild.nodeValue = fragment.templateValues[i];
                    break;
                case fragmentValueTypes.TEXT_DIRECT:
                    element.nodeValue = fragment.templateValues[i];
                    break;
                case fragmentValueTypes.FRAGMENT:
                case fragmentValueTypes.FRAGMENT_REPLACE:
                    updateFragment(context, oldFragment.templateValues[i], fragment.templateValues[i], element, component);
                    break;
                case fragmentValueTypes.COMPONENT:
                case fragmentValueTypes.COMPONENT_REPLACE:
                    if (fragment.templateValues[i].component === oldFragment.templateValues[i].component) {
                        updateComponent(templateComponent, fragment.templateValues[i].props);
                    }
                    break;
                case fragmentValueTypes.COMPONENT_CHILDREN:
                    break;
                case fragmentValueTypes.ATTR_DESIGNMODE:
                    element.designMode = fragment.templateValues[i];
                    break;
                case fragmentValueTypes.ATTR_HTMLFOR:
                    element.htmlFor = fragment.templateValues[i];
                    break;
                case fragmentValueTypes.ATTR_PLAYBACKRATE:
                    element.playbackRate = fragment.templateValues[i];
                    break;
                case fragmentValueTypes.ATTR_SRCDOC:
                    element.srcDoc = fragment.templateValues[i];
                    break;
                case fragmentValueTypes.ATTR_CHECKED:
                    element.checked = fragment.templateValues[i];
                    break;
                case fragmentValueTypes.ATTR_ISMAP:
                    element.isMap = fragment.templateValues[i];
                    break;
                case fragmentValueTypes.ATTR_LOOP:
                    element.loop = fragment.templateValues[i];
                    break;
                case fragmentValueTypes.ATTR_MUTED:
                    element.muted = fragment.templateValues[i];
                    break;
                case fragmentValueTypes.ATTR_REQUIRED:
                    element.required = fragment.templateValues[i];
                    break;
                case fragmentValueTypes.ATTR_SELECTED:
                    element.selected = fragment.templateValues[i];
                    break;
                case fragmentValueTypes.ATTR_TRUESPEED:
                    element.truespeed = fragment.templateValues[i];
                    break;
                case fragmentValueTypes.ATTR_MULTIPLE:
                    element.multiple = fragment.templateValues[i];
                    break;
                case fragmentValueTypes.ATTR_CONTROLS:
                    element.controls = fragment.templateValues[i];
                    break;
                case fragmentValueTypes.ATTR_DEFER:
                    element.defer = fragment.templateValues[i];
                    break;
                case fragmentValueTypes.ATTR_NOVALIDATE:
                    element.noValidate = fragment.templateValues[i];
                    break;
                case fragmentValueTypes.ATTR_SCOPED:
                    element.scoped = fragment.templateValues[i];
                    break;
                case fragmentValueTypes.ATTR_NO_RESIZE:
                    element.noResize = fragment.templateValues[i];
                    break;

                default:
                    //custom attribute, so simply setAttribute it
                    if (events[type] != null) {
                        eventManager.addListener(element, type, fragment.templateValues[i]);
                    } else {
                        setValueForProperty(element, type, fragment.templateValues[i]);
                    }
                    break;
            }
        }
    }
}

export default updateFragmentValues;