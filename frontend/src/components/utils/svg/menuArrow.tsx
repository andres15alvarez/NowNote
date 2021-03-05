import React from 'react';

interface MenuArrowProps {
    className: string
}

export const MenuDropDown: React.FC<MenuArrowProps> = ({ className }) => {
    return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20.633 20.633"><path d="M10.79 15.617l9.648-9.646c.133-.131.195-.301.195-.473s-.062-.344-.195-.473l-.012-.012a.66.66 0 00-.472-.195h-4.682a.656.656 0 00-.473.195l-4.48 4.479-4.48-4.479a.672.672 0 00-.473-.195H.684a.66.66 0 00-.475.195l-.013.012A.657.657 0 000 5.498a.66.66 0 00.196.473l9.648 9.646a.666.666 0 00.946 0z" /></svg>)
}

export const Redo: React.FC<any> = (props) => {
    return (
        <svg {...props} className="toolbarSVG" height="512" viewBox="0 0 512.231 512.231" width="512" xmlns="http://www.w3.org/2000/svg"><path d="M40 319.673c0-74.439 60.561-135 135-135h260.346l-97.515 97.885 28.338 28.23 146.062-146.615L366.169 17.558l-28.338 28.23 98.512 98.885H175c-96.495 0-175 78.505-175 175s78.505 175 175 175h236v-40H175c-74.439 0-135-60.56-135-135z" /></svg>
    )
}

export const Tab: React.FC<any> = (props) => {
    return (
        <>
            <svg className="toolbarSVG" {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 448"><path d="M225.813 126.187l76.48 76.48H0v42.666h302.293l-76.48 76.48L256 352l128-128L256 96zM405.333 96H448v256h-42.667z" /></svg>        </>
    )
}