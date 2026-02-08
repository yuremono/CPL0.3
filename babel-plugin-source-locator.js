/**
 * ソースロケーターBabelプラグイン
 * 開発環境でのみJSX要素に data-l="{コンポーネント名}{行番号}" 属性を注入
 */
module.exports = function ({ types: t }) {
  return {
    visitor: {
      JSXOpeningElement(path, state) {
        const filename = state.file.opts.filename || "unknown";
        const loc = path.node.loc;

        if (!loc) return;

        // ファイル名から拡張子とパスを除去してコンポーネント名を作成
        // 例: src/components/content-projection-layer/editable-wrapper.tsx -> EditableWrapper
        const basename = filename.split('/').pop() || 'unknown';
        const componentName = basename
          .replace(/\.(tsx?|jsx?)$/, '')
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join('');

        const lineNumber = loc.start.line;
        const attr = t.jsxAttribute(
          t.jsxIdentifier("data-l"),
          t.stringLiteral(`${componentName}${lineNumber}`)
        );

        path.node.attributes.unshift(attr);
      }
    }
  };
};
