import { PacingPayload } from '@src/types'
import { Stack } from '@mui/material'
import styled from '@emotion/styled'

const StyledTable = styled.table`
  width: 100%;
  height: 1rem;

  & td, & th {
    border: none;
  }

  & th {
    background-color: #0478aa;
    color: white;
  }

  & tr:nth-of-type(even) {
    background-color: #f2f2f2;
  }

  & tr:hover {
    background-color: #ddd;
  }
`

interface PaceListProps {
  payload: PacingPayload
}

export function PaceList (props: PaceListProps): JSX.Element {
  const { payload: { unit, distance, pacing } } = props
  if (distance === undefined || pacing === undefined) return <></>

  const length = Math.ceil(distance)
  if (length > 1000) return <></>

  const tableList: Array<{
    unit: number
    time: string
  }> = Array.from({ length }).map((_, index) => {
    const unit = index + 1 === length ? distance : index + 1
    const time = unit * pacing
    const h = Math.floor(time / (60 * 60))
    const m = Math.floor(time % (60 * 60) / (60))
    const s = Math.floor(time % (60))
    return {
      unit,
      time: `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
    }
  })

  function TableList ({ tableList }: {
    tableList: Array<{
      unit: number
      time: string
    }>
  }): JSX.Element {
    return <StyledTable>
      <thead>
      <tr>
        <th>{unit}</th>
        <th>time</th>
      </tr>
      </thead>
      <tbody>
      {
        tableList.map(({ unit, time }, index) => {
          return <tr key={index}>
            <td>{unit}</td>
            <td>{time}</td>
          </tr>
        })
      }
      </tbody>
    </StyledTable>
  }

  return <Stack
      direction='row'
      justifyContent='space-between'
      spacing={2}
      sx={{
        textAlign: 'center'
      }}
  >
    <TableList tableList={ tableList.slice(0, tableList.length / 2 + 1) }/>
    <TableList tableList={ tableList.slice(tableList.length / 2 + 1) }/>
  </Stack>
}
