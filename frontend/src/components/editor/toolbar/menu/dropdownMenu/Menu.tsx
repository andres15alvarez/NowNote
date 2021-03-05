import React from 'react';
import './menu.scss'
import { Check } from "../../../../utils/svg/check";
import { MenuDropDown } from "../../../../utils/svg/menuArrow";
const { useState } = React;

type subMenuItemsProp = {
    name: string,
    component: JSX.Element | string;
    active: boolean;
}[];

interface MenuProps {
    className?: string,
    subMenuItems: subMenuItemsProp | JSX.Element,
    onClickSubMenuItem: any,
    defaultItem?: any,
}

export const Menu: React.FC<MenuProps> = ({ className, subMenuItems, onClickSubMenuItem, defaultItem }) => {
    const [open, setOpen] = useState(false);
    const handleClickMenu = (e: any) => {
        if (e.target.tagName === "INPUT") return;
        setOpen(prev => !prev)
    }
    return (
        <>
            <div className={`menu ${className} ${open ? "active" : ""}`} onClick={handleClickMenu}>
                {defaultItem ? defaultItem : (subMenuItems as subMenuItemsProp).map((item: any) => {
                    if (item.active) return item.component;
                    return '';
                })}
                <MenuDropDown className="menuArrow" />
                <div unselectable='on' className="subMenu">
                    {Array.isArray(subMenuItems) ? subMenuItems.map((item, idx) => (
                        <li onClick={() => onClickSubMenuItem({ item, idx })} key={`${item}-${idx}`}>
                            <Check className={`subMenuCheck ${item.active ? "active" : ""}`} />
                            {item.component}
                        </li>
                    ))
                        :
                        subMenuItems
                    }
                </div>
            </div>
        </>
    )
}