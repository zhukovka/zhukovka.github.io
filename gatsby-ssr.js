const React = require('react')
const { withPrefix } = require('gatsby')

exports.onRenderBody = ({ setHeadComponents }) => {
  setHeadComponents([
    <link key="icon-svg" rel="icon" href={withPrefix('/favicon.svg')} type="image/svg+xml" />,
    <link key="icon-ico" rel="icon" href={withPrefix('/favicon.ico')} sizes="48x48" />,
    <link key="icon-apple" rel="apple-touch-icon" href={withPrefix('/apple-touch-icon.png')} />,
  ])
}
