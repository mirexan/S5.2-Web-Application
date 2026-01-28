package com.boticarium.backend.infrastructure.config;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Aspect
@Component
@Slf4j
public class LoggingAspect {
	@Pointcut("execution(* com.boticarium.backend.application.service..*(..)) || " +
			"execution(* com.boticarium.backend.infrastructure.inbound.controller..*(..))")
	public void applicationPackagePointcut() {
	}

	@Around("applicationPackagePointcut()")
	public Object around(ProceedingJoinPoint joinPoint) throws Throwable {
		String methodName = joinPoint.getSignature().getName();
		String className = joinPoint.getTarget().getClass().getName();
		Object[] args = joinPoint.getArgs();

		log.info("🪶Executing {}.{}() with arguments: {}", className, methodName, Arrays.toString(args));
		try {
			Object result = joinPoint.proceed();
			log.info("✅ Leaving {}.{}() with result: {}", className, methodName, result);
			return result;
		}
		catch(IllegalArgumentException e) {
		log.error("❌ Error of arguments in {}.{}: {}", className, methodName, e.getMessage());
		throw e;
		}
	}

	@AfterThrowing(pointcut = "applicationPackagePointcut()",throwing = "e")
	public void logAfterThrowing(JoinPoint joinPoint, Throwable e) {
		log.error("🐞 Exception in {}.{}() Cause: {}",
				joinPoint.getSignature().getDeclaringTypeName(),
				joinPoint.getSignature().getName(),
				e.getMessage() != null ? e.getMessage() : "NULL");
	}
}
