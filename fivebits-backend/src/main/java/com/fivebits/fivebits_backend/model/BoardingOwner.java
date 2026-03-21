package com.fivebits.fivebits_backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@DiscriminatorValue("OWNER")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
public class BoardingOwner extends User {

    @Column(name = "business_name")
    private String businessName;

    private String address;

    @Column(name = "nic_number")
    private String nicNumber;
}