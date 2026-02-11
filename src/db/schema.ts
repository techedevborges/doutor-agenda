import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid, integer, pgEnum } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey(),
});

export const usersTableRelations = relations(usersTable, ({ many }) => ({
    usersToClinics: many(usersToClinicsTable)
}));

export const clinicsTable = pgTable("clinics", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});

export const usersToClinicsTable = pgTable("users_to_clinics", {
    userId: uuid("user_id").notNull().references(() => usersTable.id),
    clinicId: uuid("clinic_id").notNull().references(() => clinicsTable.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});

export const usersToClinicsTableRelations = relations(usersToClinicsTable, ({ one }) => ({
    user: one(usersTable, {
        fields: [usersToClinicsTable.userId],
        references: [usersTable.id],
    }),
}))

export const clinicsTableRelations = relations(clinicsTable, ({ many }) => ({
    doctors: many(doctorsTable),
    patients: many(patientsTable),
    appointments: many(appointmentsTable),
    usersToClinics: many(usersToClinicsTable)
}));

export const doctorsTable = pgTable("doctors", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    clinicId: uuid("clinic_id").notNull().references(() => clinicsTable.id, { onDelete: "cascade" }),
    avatarImageUrl: text("avatar_image_url"),
    availableFromWeekDay: integer("available_from_week_day"), // 1
    availableToWeekDay: integer("available_to_week_day"), // 5
    availableFromTime: integer("available_from_time"), // 5
    availableToTime: integer("available_to_time"), // 5
    specialty: text("specialty").notNull(),
    appointmentPriceInCents: integer("appointment_price_in_cents").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});

export const doctorsTableRelations = relations(doctorsTable, ({ one }) => ({
    clinic: one(clinicsTable, {
        fields: [doctorsTable.clinicId],
        references: [clinicsTable.id],
    }),
}));

// enum
export const patientSexEnum = pgEnum("patient_sex", ["male", "female"]);

export const patientsTable = pgTable("patient", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    phoneNumber: text("phone_number").notNull(),
    clinicId: uuid("clinic_id").notNull().references(() => clinicsTable.id, { onDelete: "cascade" }),
    patientSex: patientSexEnum("sex").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});

export const patientsTableRelations = relations(patientsTable, ({ one }) => ({
    clinic: one(clinicsTable, {
        fields: [patientsTable.clinicId],
        references: [clinicsTable.id],
    }),
}));


export const appointmentsTable = pgTable("appointments", {
    id: uuid("id").defaultRandom().primaryKey(),
    date: timestamp("date").notNull(),
    clinicId: uuid("clinic_id").notNull().references(() => clinicsTable.id),
    patientId: uuid("patient_id").notNull().references(() => patientsTable.id),
    doctorId: uuid("doctor_id").notNull().references(() => doctorsTable.id),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});

export const appointmentsTableRelations = relations(appointmentsTable, ({ one }) => ({
    clinic: one(clinicsTable, {
        fields: [appointmentsTable.clinicId],
        references: [clinicsTable.id],
    }),
    patient: one(patientsTable, {
        fields: [appointmentsTable.patientId],
        references: [patientsTable.id],
    }),
    doctor: one(doctorsTable, {
        fields: [appointmentsTable.doctorId],
        references: [doctorsTable.id],
    }),
}));