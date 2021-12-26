import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useState } from 'react';

type MatrixRowValues = [string, string, string, string];
type MatrixValues = [MatrixRowValues, MatrixRowValues, MatrixRowValues, MatrixRowValues];

const DEFAULT_CELL_VALUE = '0';
const DEFAULT_ROW_VALUE: MatrixRowValues = [
  DEFAULT_CELL_VALUE,
  DEFAULT_CELL_VALUE,
  DEFAULT_CELL_VALUE,
  DEFAULT_CELL_VALUE,
];
const DEFAULT_MATRIX_VALUE: MatrixValues = [
  DEFAULT_ROW_VALUE,
  DEFAULT_ROW_VALUE,
  DEFAULT_ROW_VALUE,
  DEFAULT_ROW_VALUE,
];

const MATRIX_CELL_BORDER_COLOR = 'black';

function MatrixInputCell({
  value,
  onValueChanged,
}: {
  value: string;
  onValueChanged: (newValue: string) => void;
}) {
  function handleInput(event: React.ChangeEvent<HTMLInputElement>): void {
    onValueChanged(event.target.value);
  }

  return (
    <Box
      alignItems="center"
      border={`1px solid ${MATRIX_CELL_BORDER_COLOR}`}
      display="flex"
      height={48}
      justifyContent="center"
      width={48}
    >
      <input
        style={{
          border: 'none',
          height: '30px',
          margin: 0,
          padding: 0,
          textAlign: 'center',
          width: '30px',
        }}
        value={value}
        onChange={handleInput}
      />
    </Box>
  );
}

function MatrixInputRow({
  rowValues,
  onRowValuesChanged,
}: {
  rowValues: MatrixRowValues;
  onRowValuesChanged: (newRowValues: MatrixRowValues) => void;
}) {
  function onCellValueChanged(colIndex: number, newValue: string): void {
    const newRowValues = [...rowValues] as MatrixRowValues;
    newRowValues[colIndex] = newValue;
    onRowValuesChanged(newRowValues);
  }

  return (
    <Box display="flex" flexDirection="row">
      <MatrixInputCell
        value={rowValues[0]}
        onValueChanged={(newValue: string) => onCellValueChanged(0, newValue)}
      />
      <MatrixInputCell
        value={rowValues[1]}
        onValueChanged={(newValue: string) => onCellValueChanged(1, newValue)}
      />
      <MatrixInputCell
        value={rowValues[2]}
        onValueChanged={(newValue: string) => onCellValueChanged(2, newValue)}
      />
      <MatrixInputCell
        value={rowValues[3]}
        onValueChanged={(newValue: string) => onCellValueChanged(3, newValue)}
      />
    </Box>
  );
}

interface Props {
  matrixDescription: string;
  matrixName: string;
}

export default function MatrixInputGrid(props: Props) {
  const [matrixValues, setMatrixValues] = useState<MatrixValues>(DEFAULT_MATRIX_VALUE);

  // TODO: validate values before sending to callback
  // const newValueAsFloat = parseFloat(newValue);
  // if (!isNaN(newValueAsFloat) && newValueAsFloat.toString() === newValue.replace(/^0+/, '')) ...

  function onRowValuesChanged(rowIndex: number, newRowValues: MatrixRowValues): void {
    const newMatrixValues = [...matrixValues] as MatrixValues;
    newMatrixValues[rowIndex] = newRowValues;
    setMatrixValues(newMatrixValues);
  }

  return (
    <Box alignItems="center" display="flex" flexDirection="column" paddingX={2}>
      <Box
        border={`2px solid ${MATRIX_CELL_BORDER_COLOR}`}
        display="flex"
        flexDirection="column"
        marginBottom={1}
      >
        <MatrixInputRow
          rowValues={matrixValues[0]}
          onRowValuesChanged={(newRowValues: MatrixRowValues) =>
            onRowValuesChanged(0, newRowValues)
          }
        />
        <MatrixInputRow
          rowValues={matrixValues[1]}
          onRowValuesChanged={(newRowValues: MatrixRowValues) =>
            onRowValuesChanged(1, newRowValues)
          }
        />
        <MatrixInputRow
          rowValues={matrixValues[2]}
          onRowValuesChanged={(newRowValues: MatrixRowValues) =>
            onRowValuesChanged(2, newRowValues)
          }
        />
        <MatrixInputRow
          rowValues={matrixValues[3]}
          onRowValuesChanged={(newRowValues: MatrixRowValues) =>
            onRowValuesChanged(3, newRowValues)
          }
        />
      </Box>
      <Typography color="InfoText" variant="body1">
        {props.matrixName}
      </Typography>
      <Typography color="GrayText" variant="body2">
        {props.matrixDescription}
      </Typography>
    </Box>
  );
}
