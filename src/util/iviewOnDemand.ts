import {
    Alert,
    Button,
    ButtonGroup,
    Card,
    Checkbox,
    CheckboxGroup,
    Col,
    Collapse,
    Content,
    DatePicker,
    Form,
    FormItem,
    Header,
    Icon,
    Input,
    InputNumber,
    LoadingBar,
    Menu,
    MenuGroup,
    MenuItem,
    Message,
    Modal,
    Notice,
    Option,
    OptionGroup,
    Page,
    Radio,
    RadioGroup,
    Row,
    Select,
    Spin,
    Switch,
    Table,
    TabPane,
    Tabs,
    Tooltip,
    Upload,
    Steps,
    // @ts-ignore
    Step,
    Split,
    Poptip
} from 'iview'
// @ts-ignore
import MenuSub from 'iview/src/components/submenu'

const componentMap = {
    // @ts-ignore
    Alert,
    // @ts-ignore
    Button,
    // @ts-ignore
    ButtonGroup,
    // @ts-ignore
    Checkbox,
    // @ts-ignore
    CheckboxGroup,
    // @ts-ignore
    Card,
    // @ts-ignore
    Col,
    // @ts-ignore
    Collapse,
    // @ts-ignore
    Content,
    // @ts-ignore
    DatePicker,
    // @ts-ignore
    Form,
    // @ts-ignore
    FormItem,
    // @ts-ignore
    Header,
    // @ts-ignore
    Icon,
    // @ts-ignore
    Input,
    // @ts-ignore
    InputNumber,
    // @ts-ignore
    Menu,
    // @ts-ignore
    MenuGroup,
    // @ts-ignore
    MenuItem,
    // @ts-ignore
    Message,
    // @ts-ignore
    Modal,
    // @ts-ignore
    Notice,
    // @ts-ignore
    Option,
    // @ts-ignore
    OptionGroup,
    // @ts-ignore
    Page,
    // @ts-ignore
    Radio,
    // @ts-ignore
    RadioGroup,
    // @ts-ignore
    Row,
    // @ts-ignore
    Select,
    // @ts-ignore
    MenuSub,
    // @ts-ignore
    Table,
    // @ts-ignore
    TabPane,
    // @ts-ignore
    Tabs,
    // @ts-ignore
    Tooltip,
    // @ts-ignore
    Upload,
    // @ts-ignore
    Steps,
    // @ts-ignore
    Step,
    // @ts-ignore
    Spin,
    // @ts-ignore
    "i-switch": Switch,
    // @ts-ignore
    "i-input": Input,
    // @ts-ignore
    "i-table": Table,
    // @ts-ignore
    "i-col": Col,
    // @ts-ignore
    "i-select": Select,
    // @ts-ignore
    Split,
    // @ts-ignore
    Poptip,
};

class iviewOnDemand {
    install(Vue: any, options: any) {
        this.installComponent(Vue);
    }

    /*------------------添加iview组件------------------*/
    installComponent(Vue: any) {
        for (const key in componentMap) {
            // @ts-ignore
            Vue.component(key, componentMap[key]);
        }

        // @ts-ignore
        Vue.prototype.$Loading = LoadingBar;
        // @ts-ignore
        Vue.prototype.$Message = Message;
        // @ts-ignore
        Vue.prototype.$Modal = Modal;
        // @ts-ignore
        Vue.prototype.$Notice = Notice;
        // @ts-ignore
        Vue.prototype.$Spin = Spin;
    }
}

export default new iviewOnDemand();
