import styled from '@emotion/styled'
import { Switch } from '@mui/material'

export const UnitSwitch = styled(Switch)(({ theme }) => ({
  padding: 8,
  '& .MuiSwitch-track': {
    borderRadius: 22 / 2,
    '&:before, &:after': {
      content: '""',
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      width: 16,
      height: 16
    },
    '&:before': {
      backgroundImage: 'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><text x="3" y="18"><tspan style="font-weight:bold; font-size:16px; fill: white;">mi</tspan></text></svg>\')',
      left: 12
    },
    '&:after': {
      backgroundImage: 'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><text x="1" y="18"><tspan style="font-weight:bold; font-size:16px; fill: white;">km</tspan></text></svg>\')',
      right: 12
    }
  },
  '& .MuiSwitch-thumb': {
    boxShadow: 'none',
    width: 16,
    height: 16,
    margin: 2
  }
}))
