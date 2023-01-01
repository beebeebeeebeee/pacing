import { Container, Stack } from '@mui/material'
import { useState } from 'react'
import { PacingPayload } from '@src/types'
import { INIT_PAYLOAD } from '@src/constants'
import { Calculator } from '@src/components'
import { PaceList } from '@src/components/PaceList'

export function Pacing (): JSX.Element {
  const [payload, setPayload] = useState<PacingPayload>(INIT_PAYLOAD)

  return <Container maxWidth="sm">
      <Stack spacing={1}>
          <Calculator payload={payload} setPayload={setPayload}/>
          <PaceList payload={payload}/>
      </Stack>
  </Container>
}
