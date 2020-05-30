declare global {

    interface MenuItem {
        id: string,
        icon: string,
        name: string,
        path?: string,
        child?: Array<MenuItem>
    }

    interface FilterRule {
        path: string,
        filterEnable: (param: any) => boolean,
        doFilter: (menuConfig: Array<MenuItem>) => Array<MenuItem>
    }

}

export {MenuItem, FilterRule};