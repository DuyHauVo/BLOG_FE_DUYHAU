import React from "react";
import {
  Pagination,
  Stack,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";

interface PaginationsProps {
  totalPages: number;
  page: number;
  setPage: (value: number) => void;
  limit: number;
  setLimit: (value: number) => void;
}

const Paginations: React.FC<PaginationsProps> = ({
  totalPages,
  page,
  setPage,
  limit,
  setLimit,
}) => {
  const limitOptions = [5, 10, 25];

  const handleLimitChange = (e: SelectChangeEvent) => {
    setLimit(Number(e.target.value));
  };

  return (
    <Stack direction="row" className="px-3 justify-between mt-3">
      <Pagination
        count={totalPages}
        page={page}
        onChange={(_, value) => setPage(value)}
        color="primary"
      />

      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel id="limit-label">Dòng/trang</InputLabel>
        <Select
          labelId="limit-label"
          value={limit.toString()}
          label="Dòng/trang"
          onChange={handleLimitChange}
        >
          {limitOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  );
};

export default Paginations;
