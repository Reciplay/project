"use client";

import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import {
  Box,
  Button,
  InputAdornment,
  Popover,
  TextField,
  Typography,
} from "@mui/material";
import classNames from "classnames"; // 선택된 월 강조를 위한 className 결합
import React, { useState } from "react";
import styles from "./monthDatePicker.module.scss"; // SCSS 모듈

function Component() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const months = [
    { value: 1, label: "1월" },
    { value: 2, label: "2월" },
    { value: 3, label: "3월" },
    { value: 4, label: "4월" },
    { value: 5, label: "5월" },
    { value: 6, label: "6월" },
    { value: 7, label: "7월" },
    { value: 8, label: "8월" },
    { value: 9, label: "9월" },
    { value: 10, label: "10월" },
    { value: 11, label: "11월" },
    { value: 12, label: "12월" },
  ];

  const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const handleMonthClick = (month: number) => {
    setSelectedMonth(month);
    handleClosePopover();
  };

  const open = Boolean(anchorEl);
  const id = open ? "month-year-popover" : undefined;

  const formattedValue =
    selectedYear && selectedMonth
      ? `${selectedYear}${String(selectedMonth).padStart(2, "0")}`
      : "";

  return (
    <Box className={styles.datePickerContainer}>
      <TextField
        className={styles.datePickerInput}
        id="date-input"
        label="취득일"
        placeholder="취득일"
        value={formattedValue}
        InputProps={{
          readOnly: true,
          endAdornment: (
            <InputAdornment position="end">
              <Button
                aria-describedby={id}
                variant="text"
                onClick={handleOpenPopover}
                className={styles.calendarIconButton}
              >
                <CalendarTodayIcon />
              </Button>
            </InputAdornment>
          ),
        }}
        variant="outlined"
        onClick={handleOpenPopover}
      />

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        className={styles.datePickerPopover}
      >
        <Box className={styles.popoverContent}>
          <Box className={styles.popoverHeader}>
            <Button onClick={() => setSelectedYear((y) => y - 1)}>←</Button>
            <Typography>{selectedYear}년</Typography>
            <Button onClick={() => setSelectedYear((y) => y + 1)}>→</Button>
          </Box>

          <Box className={styles.monthGrid}>
            {months.map((month) => (
              <Button
                key={month.value}
                className={classNames(
                  styles.monthButton,
                  selectedMonth === month.value && styles.selected,
                )}
                onClick={() => handleMonthClick(month.value)}
              >
                {month.label}
              </Button>
            ))}
          </Box>
        </Box>
      </Popover>
    </Box>
  );
}

export default function MonthDatePicker() {
  return <Component />;
}
