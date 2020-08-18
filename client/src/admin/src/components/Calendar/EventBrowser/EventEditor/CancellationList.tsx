// Created by josh on 16/04/2020
import React, { FunctionComponent } from "react";

import { parseDate } from "../../../../../../../public/js";
import CalendarEvent, { Cancellation } from "../../../../shared/Types";

interface CancellationListProps {
	handleClick: Function,
	cancellations: Cancellation[],
	event: CalendarEvent
}

export const CancellationList: FunctionComponent<CancellationListProps> = ({ cancellations, handleClick, event }) => (
  <table className="table cancellation-list is-fullwidth is-hoverable">
    <thead>
      <tr>
        <th><abbr title="Date of cancellation">Date</abbr></th>
        <th><abbr title="Cancelled by">By</abbr></th>
        <th><abbr title="Start of reason">Why</abbr></th>
      </tr>
    </thead>

    <tbody>
      {
			cancellations.map(cancellation => (
  <CancellationItem cancellation={cancellation} key={cancellation.id} handleClick={handleClick} when={cancellation.when || event.when} />
			))

		}
    </tbody>
  </table>
);
export default CancellationList;

const CancellationItem = ({ cancellation, handleClick, when }: {cancellation: Cancellation, handleClick: Function, when: string}) => (
  <tr className="cancellation-item" onClick={() => handleClick(cancellation)}>
    <td>
      {parseDate(new Date(when))}
    </td>
    <td>
      {cancellation.cancelledBy.firstName} {cancellation.cancelledBy.lastName} {`<${cancellation.cancelledBy.username}>`}
    </td>
    <td>
      {(cancellation.reason && cancellation.reason.substr(0, 50)) || ""}
    </td>
  </tr>

);
