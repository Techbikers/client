import React, { PropTypes } from 'react'
import { FormattedNumber } from 'react-intl'

const FundraisingTotal = ({ total, currency = "GBP" }) => (
  <FormattedNumber
    style="currency"
    currency={currency}
    value={total}
    maximumFractionDigits={0}
    minimumFractionDigits={0}
  />
)

FundraisingTotal.propTypes = {
  total: PropTypes.number.isRequired,
  currency: PropTypes.string
}

export default FundraisingTotal
