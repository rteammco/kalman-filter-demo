import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useState } from 'react';
import { SimulationMatrix, SimulationMatrixRow } from '../simulation/SimulationData';

const MATRIX_CELL_BORDER_COLOR = 'black';
const MATRIX_CELL_BORDER_COLOR_DISABLED = 'lightgray';

function MatrixInputCell({
  isDisabled,
  value,
  onValueChanged,
}: {
  isDisabled: boolean;
  value: number;
  onValueChanged: (newValue: number) => void;
}) {
  const [rawCellValue, setRawCellValue] = useState<string>(value.toString());

  function handleInput(event: React.ChangeEvent<HTMLInputElement>): void {
    const newCellValue = event.target.value;
    const newValueAsFloat = parseFloat(newCellValue);
    if (!isNaN(newValueAsFloat)) {
      onValueChanged(newValueAsFloat);
    }
    setRawCellValue(newCellValue);
  }

  function handleBlur(): void {
    setRawCellValue(value.toString());
  }

  return (
    <Box
      alignItems="center"
      border={`1px solid ${
        isDisabled ? MATRIX_CELL_BORDER_COLOR_DISABLED : MATRIX_CELL_BORDER_COLOR
      }`}
      display="flex"
      height={48}
      justifyContent="center"
      style={isDisabled ? { backgroundColor: 'disabled' } : {}}
      width={48}
    >
      <input
        disabled={isDisabled}
        style={{
          border: 'none',
          height: '48px',
          margin: 0,
          padding: 0,
          textAlign: 'center',
          width: '48px',
        }}
        value={rawCellValue}
        onBlur={handleBlur}
        onChange={handleInput}
      />
    </Box>
  );
}

function MatrixInputRow({
  isDisabled,
  rowValues,
  onRowValuesChanged,
}: {
  isDisabled: boolean;
  rowValues: SimulationMatrixRow;
  onRowValuesChanged: (newRowValues: SimulationMatrixRow) => void;
}) {
  function onCellValueChanged(colIndex: number, newValue: number): void {
    const newRowValues = [...rowValues] as SimulationMatrixRow;
    newRowValues[colIndex] = newValue;
    onRowValuesChanged(newRowValues);
  }

  return (
    <Box display="flex" flexDirection="row">
      <MatrixInputCell
        isDisabled={isDisabled}
        value={rowValues[0]}
        onValueChanged={(newValue: number) => onCellValueChanged(0, newValue)}
      />
      <MatrixInputCell
        isDisabled={isDisabled}
        value={rowValues[1]}
        onValueChanged={(newValue: number) => onCellValueChanged(1, newValue)}
      />
      <MatrixInputCell
        isDisabled={isDisabled}
        value={rowValues[2]}
        onValueChanged={(newValue: number) => onCellValueChanged(2, newValue)}
      />
      <MatrixInputCell
        isDisabled={isDisabled}
        value={rowValues[3]}
        onValueChanged={(newValue: number) => onCellValueChanged(3, newValue)}
      />
    </Box>
  );
}

interface Props {
  isDisabled?: boolean;
  matrixDescription: string;
  matrixName: string;
  matrixValues: SimulationMatrix;
  onMatrixValuesChanged: (newMatrixValues: SimulationMatrix) => void;
}

export default function MatrixInputGrid(props: Props) {
  const { isDisabled, matrixValues } = props;

  function onRowValuesChanged(rowIndex: number, newRowValues: SimulationMatrixRow): void {
    const newMatrixValues: SimulationMatrix = [...matrixValues];
    newMatrixValues[rowIndex] = newRowValues;
    props.onMatrixValuesChanged(newMatrixValues);
  }

  return (
    <Box alignItems="center" display="flex" flexDirection="column" paddingX={2}>
      <Box
        border={`2px solid ${
          isDisabled ? MATRIX_CELL_BORDER_COLOR_DISABLED : MATRIX_CELL_BORDER_COLOR
        }`}
        display="flex"
        flexDirection="column"
        marginBottom={1}
      >
        <MatrixInputRow
          isDisabled={isDisabled === true}
          rowValues={matrixValues[0]}
          onRowValuesChanged={(newRowValues: SimulationMatrixRow) =>
            onRowValuesChanged(0, newRowValues)
          }
        />
        <MatrixInputRow
          isDisabled={isDisabled === true}
          rowValues={matrixValues[1]}
          onRowValuesChanged={(newRowValues: SimulationMatrixRow) =>
            onRowValuesChanged(1, newRowValues)
          }
        />
        <MatrixInputRow
          isDisabled={isDisabled === true}
          rowValues={matrixValues[2]}
          onRowValuesChanged={(newRowValues: SimulationMatrixRow) =>
            onRowValuesChanged(2, newRowValues)
          }
        />
        <MatrixInputRow
          isDisabled={isDisabled === true}
          rowValues={matrixValues[3]}
          onRowValuesChanged={(newRowValues: SimulationMatrixRow) =>
            onRowValuesChanged(3, newRowValues)
          }
        />
      </Box>
      <Typography color="InfoText" variant="body1">
        {props.matrixName}
      </Typography>
      <Typography color="GrayText" variant="body2">
        {props.matrixDescription}
        {isDisabled && ' (disabled)'}
      </Typography>
    </Box>
  );
}
