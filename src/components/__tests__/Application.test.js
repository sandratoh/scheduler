import React from "react";
import axios from "axios";

import { render, cleanup, waitForElement, fireEvent, getByText, getAllByTestId, getByAltText, getByPlaceholderText, queryByText } from "@testing-library/react";

import Application from "components/Application";

afterEach(cleanup);

describe("Application", () => {
  it("defaults to Monday and changes the schedule when a new day is selected", () => {
    const { getByText } = render(<Application />);
  
    return waitForElement(() => getByText("Monday")).then(() => {
      fireEvent.click(getByText("Tuesday"));
      expect(getByText("Leopold Silvers")).toBeInTheDocument();
    })
  });

  it("loads data, books an interview and reduces the spots remaining for Monday by 1", async () => {
    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"))
    
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];

    fireEvent.click(getByAltText(appointment, "Add"));
    
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });
    
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, "Save"));
    
    expect(getByText(appointment, "Saving...")).toBeInTheDocument();
    
    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));
    
    const day = getAllByTestId(container, "day")
      .find(day => queryByText(day, "Monday"));
      
    expect(getByText(day, "no spots remaining")).toBeInTheDocument();
  });

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointment = getAllByTestId(container, "appointment")
      .find(appointment => queryByText(appointment, "Archie Cohen"));

    fireEvent.click(getByAltText(appointment, "Delete"));

    expect(getByText(appointment, "Are you sure you would like to delete?")).toBeInTheDocument();
    
    fireEvent.click(getByText(appointment, "Confirm"));
    
    expect(getByText(appointment, "Deleting...")).toBeInTheDocument();
    
    await waitForElement(() => getByAltText(appointment, "Add"));
    
    const day = getAllByTestId(container, "day")
      .find(day => queryByText(day, "Monday"));
      
    expect(getByText(day, "2 spots remaining")).toBeInTheDocument();
    
  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointment = getAllByTestId(container, "appointment")
      .find(appointment => queryByText(appointment, "Archie Cohen"));

    fireEvent.click(getByAltText(appointment, "Edit"));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Ai Dubble" }
    })
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    
    fireEvent.click(getByText(appointment, "Save"));

    expect(getByText(appointment, "Saving...")).toBeInTheDocument();

    await waitForElement(() => getByText(appointment, "Ai Dubble"));
    
    expect(getByText(appointment, "Sylvia Palmer")).toBeInTheDocument();

    const day = getAllByTestId(container, "day")
      .find(day => queryByText(day, "Monday"));
      
    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
  });

  it("shows the save error when failing to save an appointment", async () => {
    axios.put.mockRejectedValueOnce();

    // 1. Render the Application.
    const { container } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // 3. Find first available appointment
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];

    fireEvent.click(getByAltText(appointment, "Add"));

    // 4. Enter appointment detail
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });
    
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    
    // 5. Click on "Save" button
    fireEvent.click(getByText(appointment, "Save"));

    // 6. Expect "Saving..." component to display
    expect(getByText(appointment, "Saving...")).toBeInTheDocument();

    // 7. Expect error message to show up.
    await waitForElement(() => getByText(appointment, "Error"));
    expect(getByText(appointment, "Could not save appointment")).toBeInTheDocument();

    // 8. Click on close button
    fireEvent.click(getByAltText(appointment, "Close"));

    // 9. Expect to go back to previous page with filled form
    expect(getByText(appointment, "Cancel") && getByText(appointment, "Save")).toBeInTheDocument();

    // 10. Check that the DayListItem with the text "Monday" also has the text "1 spot remaining".
    const day = getAllByTestId(container, "day")
      .find(day => queryByText(day, "Monday"));
    
    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
  });

  it("shows the delete error when failing to delete an appointment", async () => {
    axios.delete.mockRejectedValueOnce();

    // 1. Render the Application.
    const { container, debug } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // 3. Find first booked appointment
    const appointment = getAllByTestId(container, "appointment")
      .find(appointment => queryByText(appointment, "Archie Cohen"));
    
    // 4. Click on "Delete" button
    fireEvent.click(getByAltText(appointment, "Delete"));

    fireEvent.click(getByText(appointment, "Confirm"));

    // 5. Expect "Deleting..." component to display
    expect(getByText(appointment, "Deleting...")).toBeInTheDocument();
    // 6. Expect error message to show up.
    await waitForElement(() => getByText(appointment, "Error"));
    expect(getByText(appointment, "Could not delete appointment")).toBeInTheDocument();

    // 7. Click on close button
    fireEvent.click(getByAltText(appointment, "Close"));

    // 8. Expect to go back to previous page with appointment details
    expect(getByAltText(appointment, "Edit") && getByAltText(appointment, "Delete")).toBeInTheDocument();

    // 9. Check that the DayListItem with the text "Monday" also has the text "1 spot remaining".
    const day = getAllByTestId(container, "day")
      .find(day => queryByText(day, "Monday"));
    
    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();

    debug();
  });

})
