import { PacingPayload } from '@src/types'
import React, { useState } from 'react'
import { DistanceUnitConstant, FieldConstant } from '@src/constants'
import { Autocomplete, Button, Card, CardContent, FormControlLabel, Stack, TextField, Typography } from '@mui/material'
import { UnitSwitch } from '@src/components/UnitSwitch'
import { INIT_PAYLOAD } from '@src/constants/init.payload'

const UNIT_FACTOR = 0.62137119

const COLOR = {
  backgroundColor: '#f3f3f3'
}

interface CalculatorProps {
  payload: PacingPayload
  setPayload: React.Dispatch<React.SetStateAction<PacingPayload>>
}

export function Calculator (props: CalculatorProps): JSX.Element {
  const { payload, setPayload } = props
  const [calculated, setCalculated] = useState<FieldConstant>()

  function setUnit (unit: DistanceUnitConstant): void {
    let { distance } = payload
    if (distance === undefined) return

    switch (unit) {
      case DistanceUnitConstant.KILOMETERS:{
        distance = distance / UNIT_FACTOR
        break
      }
      case DistanceUnitConstant.MILES:{
        distance = distance * UNIT_FACTOR
        break
      }
    }

    setPayload(payload => ({
      ...payload,
      distance,
      unit
    }))
  }

  function setDistance (distance: number): void {
    const targetPayload: PacingPayload = { ...payload, distance }
    calculate(FieldConstant.DISTANCE, targetPayload)
  }

  function setTime ({ h, m, s }: Partial<Record<'h' | 'm' | 's', number>>): void {
    if ([h, m, s].find(e =>
      e !== undefined &&
            (
              e.toString().includes('.') ||
                e < 0
            )
    ) !== undefined) return

    let targetPayload: PacingPayload = { ...payload }

    switch (true) {
      case h !== undefined : {
        targetPayload = {
          ...payload,
          time: (payload?.time ?? 0) + (h! - Math.floor((payload?.time ?? 0) / 60 / 60)) * 60 * 60
        }
        break
      }
      case m !== undefined : {
        targetPayload = {
          ...payload,
          time: (payload?.time ?? 0) + (m! - Math.floor((payload?.time ?? 0) % (60 * 60) / 60)) * 60
        }
        break
      }
      case s !== undefined : {
        targetPayload = {
          ...payload,
          time: (payload?.time ?? 0) + (s! - Math.floor((payload?.time ?? 0) % 60))
        }
        break
      }
    }

    calculate(FieldConstant.TIME, targetPayload)
  }

  function setPacing ({ m, s }: Partial<Record< 'm' | 's', number>>): void {
    if ([m, s].find(e =>
      e !== undefined &&
            (
              e.toString().includes('.') ||
                e < 0
            )
    ) !== undefined) return

    let targetPayload: PacingPayload = { ...payload }

    switch (true) {
      case m !== undefined : {
        targetPayload = {
          ...payload,
          pacing: (payload?.pacing ?? 0) + (m! - Math.floor((payload?.pacing ?? 0) % (60 * 60) / 60)) * 60
        }
        break
      }
      case s !== undefined : {
        targetPayload = {
          ...payload,
          pacing: (payload?.pacing ?? 0) + (s! - Math.floor((payload?.pacing ?? 0) % 60))
        }
        break
      }
    }

    calculate(FieldConstant.PACING, targetPayload)
  }

  function calculate (trigger: FieldConstant, targetPayload: PacingPayload): void {
    const { distance, time, pacing } = targetPayload
    setPayload(targetPayload)

    if ([distance, time, pacing].filter(e => e !== undefined).length < 2) return

    switch (trigger) {
      case FieldConstant.DISTANCE: {
        if (calculated !== undefined && calculated !== FieldConstant.DISTANCE) {
          calculateRouter(calculated, targetPayload)
          break
        }
        switch (true) {
          case time !== undefined : {
            calculatePacing(targetPayload)
            break
          }
          case pacing !== undefined : {
            calculateTime(targetPayload)
            break
          }
        }
        break
      }
      case FieldConstant.TIME: {
        if (calculated !== undefined && calculated !== FieldConstant.TIME) {
          calculateRouter(calculated, targetPayload)
          break
        }
        switch (true) {
          case distance !== undefined : {
            calculatePacing(targetPayload)
            break
          }
          case pacing !== undefined : {
            calculateDistance(targetPayload)
            break
          }
        }
        break
      }
      case FieldConstant.PACING: {
        if (calculated !== undefined && calculated !== FieldConstant.PACING) {
          calculateRouter(calculated, targetPayload)
          break
        }
        switch (true) {
          case distance !== undefined : {
            calculateTime(targetPayload)
            break
          }
          case time !== undefined : {
            calculateDistance(targetPayload)
            break
          }
        }
        break
      }
    }
  }

  function calculateRouter (field: FieldConstant, targetPayload: PacingPayload): void {
    switch (field) {
      case FieldConstant.DISTANCE: {
        calculateDistance(targetPayload)
        break
      }
      case FieldConstant.TIME: {
        calculateTime(targetPayload)
        break
      }
      case FieldConstant.PACING: {
        calculatePacing(targetPayload)
        break
      }
    }
  }

  function calculateDistance (targetPayload: PacingPayload): void {
    const { time, pacing } = targetPayload

    const newDistance = Math.round(time! * pacing!)
    setPayload({
      ...targetPayload,
      distance: newDistance
    })
    setCalculated(FieldConstant.DISTANCE)
  }

  function calculateTime (targetPayload: PacingPayload): void {
    const { distance, pacing } = targetPayload

    const newPacing = Math.round(distance! * pacing!)
    setPayload({
      ...targetPayload,
      time: newPacing
    })
    setCalculated(FieldConstant.TIME)
  }
  function calculatePacing (targetPayload: PacingPayload): void {
    const { distance, time } = targetPayload

    const newPacing = Math.round(time! / distance!)
    setPayload({
      ...targetPayload,
      pacing: newPacing
    })
    setCalculated(FieldConstant.PACING)
  }

  function clear (): void {
    setPayload(INIT_PAYLOAD)
    setCalculated(undefined)
  }

  return <Card sx={{ my: 2 }}>
            <CardContent>
                <Stack spacing={2}>
                    <Stack direction='row' justifyContent='space-between'>
                        <Button
                            variant='text'
                            size='small'
                            onClick={clear}
                        >
                            clear
                        </Button>
                        <FormControlLabel
                            control={<
                                UnitSwitch
                                checked={payload.unit === DistanceUnitConstant.MILES}
                                onChange={(event) => {
                                  setUnit(event.target.checked ? DistanceUnitConstant.MILES : DistanceUnitConstant.KILOMETERS)
                                }}
                            />}
                            label="Unit"
                        />
                    </Stack>
                    <Stack spacing={1}>
                        <Typography>
                            <b>Distance</b> in {payload.unit}
                        </Typography>
                        <Autocomplete
                            freeSolo
                            fullWidth
                            size='small'
                            options={['10', '20', '21', '30', '42.195', '100'].map(label => ({ label }))}
                            renderInput={(params) => <TextField
                                {...params}
                                type='number'
                                sx={
                                    calculated === FieldConstant.DISTANCE
                                      ? COLOR
                                      : {}
                                }
                                label={payload.unit}
                            />}
                            value={(payload.distance ?? '') as any}
                            onInputChange={(_, value) => {
                              if (value === '' || value === '0') return
                              setDistance(Number(value))
                            }}
                        />
                    </Stack>
                    <Stack spacing={1}>
                        <Typography>
                            <b>Time</b>
                        </Typography>
                        <Stack direction='row' justifyContent='space-evenly' spacing={1}>
                            <TextField
                                label='hours'
                                size='small'
                                type='number'
                                sx={
                                    calculated === FieldConstant.TIME
                                      ? COLOR
                                      : {}
                                }
                                value={((payload.time) != null) ? Math.floor(payload.time / 60 / 60) : ''}
                                onChange={(event) => {
                                  setTime({ h: Number(event.target.value) })
                                }}
                                fullWidth
                            />
                            <TextField
                                label='minutes'
                                size='small'
                                type='number'
                                sx={
                                    calculated === FieldConstant.TIME
                                      ? COLOR
                                      : {}
                                }
                                value={((payload.time) != null) ? Math.floor(payload.time % (60 * 60) / 60) : ''}
                                onChange={(event) => {
                                  setTime({ m: Number(event.target.value) })
                                }}
                                fullWidth
                            />
                            <TextField
                                label='seconds'
                                size='small'
                                type='number'
                                sx={
                                    calculated === FieldConstant.TIME
                                      ? COLOR
                                      : {}
                                }
                                value={((payload.time) != null) ? Math.floor(payload.time % 60) : ''}
                                onChange={(event) => {
                                  setTime({ s: Number(event.target.value) })
                                }}
                                fullWidth
                            />
                        </Stack>
                    </Stack>
                    <Stack spacing={1}>
                        <Typography>
                            <b>Pace</b>
                        </Typography>
                        <Stack direction='row' justifyContent='space-evenly' spacing={1} alignItems='center'>
                            <TextField
                                label='minutes'
                                size='small'
                                type='number'
                                sx={
                                    calculated === FieldConstant.PACING
                                      ? COLOR
                                      : {}
                                }
                                value={((payload.pacing) != null) ? Math.floor(payload.pacing / 60) : ''}
                                onChange={(event) => {
                                  setPacing({ m: Number(event.target.value) })
                                }}
                                fullWidth
                            />
                            <TextField
                                label='seconds'
                                size='small'
                                type='number'
                                sx={
                                    calculated === FieldConstant.PACING
                                      ? COLOR
                                      : {}
                                }
                                value={((payload.pacing) != null) ? Math.floor(payload.pacing % 60) : ''}
                                onChange={(event) => {
                                  setPacing({ s: Number(event.target.value) })
                                }}
                                fullWidth
                            />
                            <Typography sx={{
                              width: '100%'
                            }}>
                                /{payload.unit}
                            </Typography>
                        </Stack>
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
}
