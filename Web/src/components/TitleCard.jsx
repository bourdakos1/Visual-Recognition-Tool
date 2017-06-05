import React from 'react'
import Radium, {Style} from 'radium'

import Styles from './Styles'
import i18next from 'i18next'

@Radium
export default class TitleCard extends React.Component {
    render() {
    	var bidi = this.context.bidi;
        var cardStyle = {
            width: '100%',
            marginBottom:'40px',
            borderRadius: '5px',
            borderColor: '#dedede',
            borderWidth: 'thin',
            borderStyle: 'solid',
            background: 'white',
        }

        var container = {
            padding: '12px',
        }

        var text = {
            base: {
                background: 'none',
                border: 'none',
                borderBottom: '1px solid #dedede',
                outline: 'none',
                width: '100%',
                padding: '10px',
                ':focus': {
                    borderBottom: `1px solid ${Styles.colorPrimary}`,
                }
            },
            error: {
                borderBottom: '2px solid #F44336',
            }
        }
        
        if (bidi.guiDir === "rtl")
        	text.base.paddingLeft = '45px'
        else
        	text.base.paddingRight = '45px'

        var optional = {
            font: Styles.fontDefault,
            color: '#9e9e9e',
        }

        return (
            <div id={this.props.id} style={[cardStyle, this.props.style]}>
                <Style scopeSelector='input::-webkit-contacts-auto-fill-button' rules={{
                    visibility: 'hidden',
                    display: 'none !important',
                    pointerEvents: 'none',
                    position: 'absolute',
                    right: '0',
                }} />
                {this.props.negative || this.props.fixedTitle ?
                    this.props.negative ?
                        <div style={[text.base, this.props.inputStyle]}>
                            {i18next.t('negative_class')}&nbsp;&nbsp;<div style={[optional, {display: 'inline-block'}]}>{i18next.t('optional')}</div>
                        </div> :
                        <div style={[text.base, this.props.inputStyle, {wordWrap: 'break-word'}]}>
                            {bidi.convert(this.props.title)}
                        </div>
                    :
                    <input type='text' style={[text.base, this.props.inputStyle, this.props.errors && this.props.title == '' ? text.error : null]}
                        id={this.props.inputId}
                        className={this.props.inputClassName}
                        placeholder={this.props.placeholder}
                        dir={bidi.getDirection(this.props.title)}
                        value = {this.props.title}
                        onChange={this.props.onChange} />
                }
                <div style={container}>
                    {this.props.children}
                </div>
            </div>
        )
    }
}

TitleCard.contextTypes = {
  bidi: React.PropTypes.object
}
