import React from 'react';

interface SectionTitleProps {
    children: React.ReactElement<{ className?: string }>;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ children }) => {
    const existingClassName = children.props?.className ?? '';
    return React.cloneElement(children, {
        className: `${existingClassName} text-3xl lg:text-5xl lg:leading-tight font-bold`.trim(),
        ...children.props
    });
};

export default SectionTitle;