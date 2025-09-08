* measurement input screen with add edit and delete functionality
* data should persist locally
* show growth charts based on available data.
* below the growth chart show the entire history of the measurements.
* show a edit and delete button on each measurement. preferably the slide on a measurement to show the edit and delete button.
* write an age helper that would calculate the age in days. we can alos use a date lib for this.
* write unit test for each of the screens.

# TODO

* Collect growth data or growth scale from WHO
* Create a baby profile by default.
* Sample growth measurement data model export interface GrowthMeasurement {
  id: string;
  date: string;               // ISO date string (UTC 00:00)
  ageInDays: number;          // derived from birthDate -> date
  weightKg: number;           // stored in SI units
  heightCm: number;           // stored in SI units
  headCm: number;             // stored in SI units
  weightPercentile?: number;  // 0–100
  heightPercentile?: number;
  headPercentile?: number;
  }

* Sample baby profile data model export interface BabyProfile {
  id: string;
  name: string;
  birthDate: string;          // ISO date string
  gender: 'male' | 'female';
  }

# Must Haves

* Normalize inputs to SI units for storage; convert for display.
* Persist a schema version to enable future migrations.

# Components

## Date selector
    * date picker via bottom sheet
    * Only allow historical dates selection
    * Future date selection should not be allowed.
    * Have error checks for future date selection.
    * Default to today's date.

## Weight unit selector component
    * Weight unit selector via bottom sheet
    * Only allow SI units selection
    * Default to lb/kg depending on timezone.

## Length unit selector component
    * Height unit selector via bottom sheet
    * Only allow SI units selection
    * Default to cm/in depending on timezone.

## Weigth selector component
    * Weight selector via bottom sheet
    * Only allow weight percentile selection
    * Default to average weight based on age calculation.
    * weights should be stored in SI units.
    * weights should change based on unit selection.
    * when user tries to save a measurement for weight we need to make sure that we only save one weight entry per day. so we will need to overwrite.
    * show a friendly user message asking for confirmation on overwrite. and notify that they can save only one record per day for accurate tracking.

## Height selector component
    * Height selector via bottom sheet
    * Only allow height percentile selection
    * Default to average height based on age calculation.
    * heights should be stored in SI units.
    * heights should change based on unit selection.
    * when user tries to save a measurement for height we need to make sure that we only save one height entry per day. so we will need to overwrite.
    * show a friendly user message asking for confirmation on overwrite. and notify that they can save only one record per day for accurate tracking.

## Head circumference selector component
    * Head circumference selector via bottom sheet
    * Only allow head circumference percentile selection
    * Default to average head circumference based on age calculation.
    * head circumference should be stored in SI units.
    * head circumference should change based on unit selection.
    * when user tries to save a measurement for head cirdumference we need to make sure that we only save one  head cirdumference measurement entry per day. so we will need to overwrite.
    * show a friendly user message asking for confirmation on overwrite. and notify that they can save only one record per day for accurate tracking.

## Age calculator component
    * Calculate age based on birth date and current date.
    * Age should always be measured in days.
    * Handle leap years.

## Toast component
    * Snackbar component should be a HOC.
    * Use snackbar for messages.
    * Show friendly messages for error, success and warning.
    * Use colors for different types of messages.

## Growth chart component
    * Show growth chart based on available data.

## Growth history component
    * Show entire history of the measurements.
    * Show edit and delete buttons on each measurement.
    * Slide on a measurement to show the edit and delete button.
    * Deletion should happen only based on user confirmation. for this we will use a dialog.
    * The history should be shown in a cronological order. newest to latest.
    * Make sure to use the utils file to handle metric conversions

## Dialog component
    * Show a dialog with a message.
    * Have tow buttons. cancel is one and the other one will come in as a Prop. we should map the prop to default button states inside the component for consistency sakes.

# Services

## Async storage service
    * ALL AsyncStorage interatction code should be placed here.
    * All CRUD operations should be handled here.
    * It should not contain any business logic.

## Service file
    * All service related code should be placed here.
    * It can have the business logic if needed.

## Utils file
    * All utility functions should be placed here.
    * Height conversion methods.
    * Weight conversion methods.
    * Head circumference conversion methods.
    * Age calculation methods.
        Transform age in days to months (with decimal precision)
        Handle edge cases where exact month data isn't available
    * Percentile calculation methods.
        use LMS parameters to calculate precise percentiles using the LMS formula

# Data Source
https://www.who.int/tools/child-growth-standards/standards/weight-for-age




