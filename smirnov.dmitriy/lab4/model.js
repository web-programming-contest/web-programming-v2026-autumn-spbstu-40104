export class Event {
  constructor(id, title, participants = [], date) {
    this.id = Number(id);
    this.title = String(title);
    this.participants = [...participants];
    this.date = date;
  }

  addParticipant(name) {
    const participant = String(name).trim();

    if (!participant || this.participants.includes(participant)) {
      return false;
    }

    this.participants.push(participant);
    return true;
  }

  removeParticipant(name) {
    const index = this.participants.indexOf(name);

    if (index === -1) {
      return false;
    }

    this.participants.splice(index, 1);
    return true;
  }

  get participantCount() {
    return this.participants.length;
  }
}

export {Event as event};

function dateKey(value) {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  return String(value);
}

export function groupEventsByDate(events) {
  return events.reduce((groups, item) => {
    const key = dateKey(item.date);

    if (!groups[key]) {
      groups[key] = [];
    }

    groups[key].push(item);
    return groups;
  }, {});
}

export function getUniqueParticipants(events) {
  return [...new Set(events.flatMap((item) => item.participants))];
}

export function groupEventsByParticipantCount(events) {
  return events.reduce((groups, item) => {
    const key = item.participantCount;

    if (!groups[key]) {
      groups[key] = [];
    }

    groups[key].push(item);
    return groups;
  }, {});
}

export function findEventsByParticipant(events, name) {
  const participant = String(name).trim();

  return events.filter((item) => item.participants.includes(participant));
}

export function findEventsByMonth(events, month) {
  const selectedMonth = Number(month);

  return events.filter((item) => {
    const value =
      item.date instanceof Date ? item.date : new Date(`${item.date}T00:00:00`);

    return (
      !Number.isNaN(value.getTime()) && value.getMonth() + 1 === selectedMonth
    );
  });
}
