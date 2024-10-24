declare namespace IconPark {
    /**
     * IconPark 图标元素的属性接口
     * @template T - HTMLElement 或其子类型
     */
    interface IconParkIconAttributes<T> extends React.HTMLAttributes<T> {
        /**
         * 包含打包的图标id
         * @description 用于指定特定的图标ID
         */
        'icon-id'?: string;

        /**
         * 包含打包的图标标识
         * @description 用于指定图标的名称
         */
        name?: string;

        /**
         * 图标大小
         * @description 可以是数字（像素）或字符串（如 '2em'）
         */
        size?: string | number;

        /**
         * 图标宽度
         * @description 指定图标的宽度，可以是像素值或其他 CSS 单位
         */
        width?: string;

        /**
         * 图标高度
         * @description 指定图标的高度，可以是像素值或其他 CSS 单位
         */
        height?: string;

        /**
         * 图标颜色
         * @description 指定图标的主要颜色
         */
        color?: string;

        /**
         * 图标描边颜色
         * @description 指定图标描边的颜色
         */
        stroke?: string;

        /**
         * 图标填充颜色
         * @description 指定图标填充区域的颜色
         */
        fill?: string;

        /**
         * 是否从右到左显示
         * @description 用于支持从右到左的语言布局
         */
        rtl?: boolean;

        /**
         * 是否旋转
         * @description 设置图标是否应该旋转
         */
        spin?: boolean;
    }

    /**
     * IconPark 图标元素接口
     * @description 定义了 IconPark 图标作为 HTML 元素时的属性
     */
    interface IconParkIconElement extends HTMLElement {
        /**
         * 包含打包的图标id
         * @description 用于指定特定的图标ID
         */
        'icon-id'?: string;

        /**
         * 包含打包的图标标识
         * @description 用于指定图标的名称
         */
        name?: string;

        /**
         * 图标大小
         * @description 指定图标的大小，通常是像素值
         */
        size?: string;

        /**
         * 图标宽度
         * @description 指定图标的宽度，可以是像素值或其他 CSS 单位
         */
        width?: string;

        /**
         * 图标高度
         * @description 指定图标的高度，可以是像素值或其他 CSS 单位
         */
        height?: string;

        /**
         * 图标颜色
         * @description 指定图标的主要颜色
         */
        color?: string;

        /**
         * 图标描边颜色
         * @description 指定图标描边的颜色
         */
        stroke?: string;

        /**
         * 图标填充颜色
         * @description 指定图标填充区域的颜色
         */
        fill?: string;

        /**
         * 是否从右到左显示
         * @description 用于支持从右到左的语言布局
         */
        rtl?: string;

        /**
         * 是否旋转
         * @description 设置图标是否应该旋转
         */
        spin?: string;
    }
}

/**
 * 扩展全局 HTMLElementTagNameMap
 * @description 将 'iconpark-icon' 元素添加到全局 HTML 元素映射中
 */
interface HTMLElementTagNameMap {
    'iconpark-icon': IconPark.IconParkIconElement;
}

/**
 * 扩展 JSX 命名空间
 * @description 为 React 中使用 IconPark 图标提供类型支持
 */
declare namespace JSX {
    interface IntrinsicElements {
        /**
         * IconPark 图标元素
         * @description 在 JSX 中使用 IconPark 图标的类型定义
         */
        'iconpark-icon': Omit<
            React.DetailedHTMLProps<
                IconPark.IconParkIconAttributes<HTMLElement>,
                HTMLElement
            >,
            'className'
        > & { class?: string };
    }
}