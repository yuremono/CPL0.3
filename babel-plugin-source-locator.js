/**
 * ソースロケーターBabelプラグイン
 * 開発環境でのみJSX要素に data-l="L{行番号}" 属性を注入
 */
module.exports = function ({ types: t }) {
  return {
    visitor: {
      JSXOpeningElement(path) {
        const loc = path.node.loc;

        if (!loc) return;

        const lineNumber = loc.start.line;
        const attr = t.jsxAttribute(
          t.jsxIdentifier("data-l"),
          t.stringLiteral(`L${lineNumber}`)
        );

        path.node.attributes.push(attr);
      }
    }
  };
};
